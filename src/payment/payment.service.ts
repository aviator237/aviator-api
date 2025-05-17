import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import axios from 'axios';
import { UuidService } from 'nestjs-uuid';
import { UserEntity } from 'src/user/entites/user.entity';
import { PaymentEntity } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentChannel } from 'src/enum/payment-channel.enum';
import { ConfigService } from '@nestjs/config';
import { NotchPayPaymentEvent } from 'src/enum/payment-event.enum';
import { WebhookDataDto } from './dto/webhook.data.dto';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class PaymentService {
  #currency: string;
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly uuidService: UuidService,
    // private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,

  ) { this.#currency = "XAF"; }

  /**
   * Crée un paiement pour un utilisateur.
   * @param createPaymentDto - Les détails du paiement à créer.
   * @param user - L'utilisateur effectuant le paiement.
   * @returns Les détails du paiement initialisé.
   */
  async createPayment(createPaymentDto: CreatePaymentDto, user: UserEntity) {
    try {
      const nestReference: string = this.uuidService.generate({ version: 4 });
      const response = await this.initializeMobilePayment(createPaymentDto.phoneNumber, createPaymentDto.amount, this.#currency, createPaymentDto.raison, nestReference);
      const newPayment: PaymentEntity = this.paymentRepository.create(createPaymentDto);
      newPayment.notchPayReference = response.transaction.reference;
      newPayment.user = user;
      newPayment.nestReference = nestReference;
      newPayment.isIncoming = true;
      newPayment.status = PaymentStatus.INITIALISE;

      this.paymentRepository.save(newPayment);
      const result = await this.makePayment(response.transaction.reference, PaymentChannel.MTN_OR_ORANGE_MONEY_CM, createPaymentDto.phoneNumber);
      return {
        "result": result,
        "reference": response.transaction.reference
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  /**
   * Crée un transfert pour un utilisateur.
   * @param createTransfertDto - Les détails du transfert à effectuer.
   * @param user - L'utilisateur effectuant le transfert.
   * @returns Les détails du transfert initialisé.
   */
  async createTransfer(createTransfertDto: CreateTransfertDto, user: UserEntity) {
    try {
      const nestReference: string = this.uuidService.generate({ version: 4 });
      let recipientId: string;
      if (!user.notchRecipientId) {
        const response = await this.createRecipiant(PaymentChannel.MTN_OR_ORANGE_MONEY_CM, createTransfertDto.phoneNumber, createTransfertDto.phoneNumber, "CM", user.lastName + " " + user.firstName, createTransfertDto.raison, nestReference, user.email);
        recipientId = response.recipient.id;
        user.notchRecipientId = response.recipient.id;
        this.userEntityRepository.save(user);
      } else {
        recipientId = user.notchRecipientId;
      }
      const notchFeePercent: number = 2;

      var exactAmountToTransfer: number = createTransfertDto.amount - createTransfertDto.amount * notchFeePercent / 100;
      exactAmountToTransfer = Math.floor(exactAmountToTransfer); // Arrondir le motant à transferer par defaut

      const newPayment: PaymentEntity = this.paymentRepository.create(createTransfertDto);
      newPayment.user = user;
      newPayment.notchPayReference = recipientId;
      newPayment.nestReference = nestReference;
      newPayment.isIncoming = false;
      newPayment.status = PaymentStatus.INITIALISE;

      user.walletAmount -= createTransfertDto.amount;

      await this.userEntityRepository.save(user);
      this.paymentRepository.save(newPayment);
      const result = await this.initializeTransfert(recipientId, exactAmountToTransfer, this.#currency, createTransfertDto.raison);
      return {
        "result": result,
        // "reference": response.recipient.
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }


  /**
   * Crée un bénéficiaire pour un transfert.
   * @param channel - Le canal de paiement (MTN, Orange, etc.).
   * @param number - Le numéro de téléphone du bénéficiaire.
   * @param phone - Le téléphone du bénéficiaire.
   * @param country - Le pays du bénéficiaire.
   * @param name - Le nom du bénéficiaire.
   * @param description - La description du bénéficiaire.
   * @param nestReference - La référence unique générée.
   * @param email - L'email du bénéficiaire.
   * @returns Les données de la réponse de l'API.
   */
  async createRecipiant(channel: string, number: string, phone: string, country: string, name: string, description: string, nestReference: string, email: string): Promise<any> {
    const data = {
      channel,
      number,
      phone,
      country,
      description,
      reference: nestReference,
      name,
      email
    };

    try {
      const response = await axios.post(
        'https://api.notchpay.co/recipients',
        data,
        {
          headers: {
            Authorization: process.env.NOTCH_PAY_PUBLIC_API_KEY,
            "X-Grant": process.env.NOTCH_PAY_PRIVATE_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la creation du beneficiaire:', error);
      throw error;
    }
  }


  /**
   * Initialise un transfert d'argent vers un bénéficiaire.
   * @param recipient - L'identifiant du bénéficiaire.
   * @param amount - Le montant à transférer.
   * @param currency - La devise utilisée.
   * @param description - La description du transfert.
   * @returns Les données de la réponse de l'API.
   */
  async initializeTransfert(recipient: string, amount: number, currency: string, description: string): Promise<any> {
    const data = { amount, currency, description, recipient };
    try {
      const response = await axios.post(
        'https://api.notchpay.co/transfers',
        data,
        {
          headers: {
            Authorization: process.env.NOTCH_PAY_PUBLIC_API_KEY,
            "X-Grant": process.env.NOTCH_PAY_PRIVATE_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du transfert:', error);
      throw error;
    }
  }

  /**
   * Initialise un paiement mobile via un numéro de téléphone.
   * @param phone - Le numéro de téléphone du client.
   * @param amount - Le montant du paiement.
   * @param currency - La devise utilisée.
   * @param description - La description du paiement.
   * @param nestReference - La référence unique générée.
   * @returns Les données de la réponse de l'API.
   */
  async initializeMobilePayment(phone: string, amount: number, currency: string, description: string, nestReference: string): Promise<any> {
    const data = { amount, reference: nestReference, currency, description, customer: { phone } };

    try {
      const response = await axios.post(
        'https://api.notchpay.co/payments/initialize',
        data,
        {
          headers: {
            Authorization: process.env.NOTCH_PAY_PUBLIC_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      // console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du paiement:', error);
      throw error;
    }
  }


  /**
   * Effectue un paiement en utilisant une référence existante.
   * @param reference - La référence du paiement.
   * @param channel - Le canal de paiement (MTN, Orange, etc.).
   * @param phone - Le numéro de téléphone du client.
   * @returns Les données de la réponse de l'API.
   */
  async makePayment(reference: string, channel: string, phone: string): Promise<any> {
    const data = { channel, data: { phone } };
    try {
      const response = await axios.put(`https://api.notchpay.co/payments/${reference}`, data,
        {
          headers: {
            Authorization: process.env.NOTCH_PAY_PUBLIC_API_KEY,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  /**
   * Récupère une liste paginée de tous les paiements.
   * @param page - Le numéro de la page.
   * @param count - Le nombre d'éléments par page.
   * @returns Une liste de paiements.
   */
  async findAll(page: number, count: number): Promise<PaymentEntity[]> {
    return await this.paymentRepository.find({ skip: page * count, take: count, order: { createAt: "DESC" } });
  }


  /**
   * Récupère une liste paginée des paiements d'un utilisateur.
   * @param user - L'utilisateur dont on veut les paiements.
   * @param page - Le numéro de la page.
   * @param count - Le nombre d'éléments par page.
   * @returns Une liste de paiements de l'utilisateur.
   */
  async getUserPayment(user: UserEntity, page: number, count: number): Promise<PaymentEntity[]> {
    return await this.paymentRepository.find({ where: { user: { id: user.id } }, order: { createAt: "DESC" }, skip: page * count, take: count });
  }


  /**
   * Gère les webhooks reçus pour les événements de paiement.
   * @param event - L'événement reçu.
   * @param data - Les données associées à l'événement.
   * @returns Un objet indiquant le statut du traitement.
   */
  async handledWebhook(event: string, data: WebhookDataDto) {
    console.log(data)
    const expectedPayment: PaymentEntity = await this.paymentRepository.findOne({ where: { notchPayReference: data.reference }, relations: { user: true } });
    if (expectedPayment) {
      if (expectedPayment.status === NotchPayPaymentEvent.PAYMENT_COMPLETE || expectedPayment.status === NotchPayPaymentEvent.TRANSFERT_COMPLETE) {
        return;
      }
      expectedPayment.status = data.status;
      expectedPayment.geo = data.geo;
      expectedPayment.fee = data.fee;
      this.paymentRepository.save(expectedPayment);

      // Importer le service de socket
      const socketService = new SocketService();

      switch (event) {
        case NotchPayPaymentEvent.PAYMENT_COMPLETE:
          expectedPayment.user.walletAmount += expectedPayment.amount;
          this.userEntityRepository.save(expectedPayment.user);

          // Envoyer l'événement de mise à jour du paiement à l'utilisateur
            // Envoyer l'événement de mise à jour du paiement
            await socketService.sendPaymentUpdate(expectedPayment.user.id, expectedPayment);

            // Envoyer l'événement de mise à jour du montant du portefeuille
            await socketService.sendWalletAmount(expectedPayment.user.id, expectedPayment.user.walletAmount);
          break;
        case NotchPayPaymentEvent.TRANSFERT_COMPLETE:
          // Envoyer l'événement de mise à jour du paiement à l'utilisateur
// Envoyer l'événement de mise à jour du paiement
await socketService.sendPaymentUpdate(expectedPayment.user.id, expectedPayment);

// Envoyer l'événement de mise à jour du montant du portefeuille
await socketService.sendWalletAmount(expectedPayment.user.id, expectedPayment.user.walletAmount);


          this.userEntityRepository.save(expectedPayment.user);
          break;
        case NotchPayPaymentEvent.TRANSFERT_ECHOUE:
          expectedPayment.user.walletAmount += expectedPayment.amount;
          this.userEntityRepository.save(expectedPayment.user);

          // Envoyer l'événement de mise à jour du paiement à l'utilisateur
          await socketService.sendPaymentUpdate(expectedPayment.user.id, expectedPayment);

          // Envoyer l'événement de mise à jour du montant du portefeuille
          await socketService.sendWalletAmount(expectedPayment.user.id, expectedPayment.user.walletAmount);


          break;
        case NotchPayPaymentEvent.PAYMENT_ECHOUE:
          // Envoyer l'événement de mise à jour du paiement à l'utilisateur
          await socketService.sendPaymentUpdate(expectedPayment.user.id, expectedPayment);

          break;
        case NotchPayPaymentEvent.PAYMENT_REMBOURSE_AU_CLIENT:
          expectedPayment.user.walletAmount -= expectedPayment.amount;
          this.userEntityRepository.save(expectedPayment.user);

            // Envoyer l'événement de mise à jour du paiement
            await socketService.sendPaymentUpdate(expectedPayment.user.id, expectedPayment);

            // Envoyer l'événement de mise à jour du montant du portefeuille
            await socketService.sendWalletAmount(expectedPayment.user.id, expectedPayment.user.walletAmount);
          break;
        default:
          break;
      }

      // this.firebaseService.updatePayment(data.reference, data.status);
    }
    return {
      "status": "ok"
    };
  }

  /**
   * Récupère le pourcentage de réservation pour les tickets.
   * @returns Le pourcentage de réservation.
   */
  getReservationAmount(): number {
    return this.configService.get<number>('TICKET_RESERVATION_PERCENT');
  }

  /**
   * Récupère un paiement par son identifiant.
   * @param id - L'identifiant du paiement.
   * @returns Le paiement correspondant.
   */
  async findOne(id: number): Promise<PaymentEntity> {
    return await this.paymentRepository.findOneBy({ id: id });
  }

  /**
   * Met à jour un paiement existant.
   * @param id - L'identifiant du paiement.
   * @param updatePaymentDto - Les nouvelles données du paiement.
   * @returns Un message indiquant l'action effectuée.
   */
  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  /**
   * Supprime un paiement par son identifiant.
   * @param id - L'identifiant du paiement.
   * @returns Un message indiquant l'action effectuée.
   */
  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
