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


  private async initializePayment(email: string, amount: number, currency: string, description: string, callbackUrl: string,): Promise<any> {
    const data = {
      amount,
      currency,
      description,
      customer: {
        email,
      },
    };

    try {
      const response = await axios.post(
        'https://api.notchpay.co/payments/initialize',
        data,
        {
          headers: {
            Authorization: process.env.NOTCH_PAY_PUBLIC_API_KEY, // Remplacez par votre clé publique
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du paiement:', error);
      throw error;
    }
  }


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


  async findAll(page: number, count: number): Promise<PaymentEntity[]> {
    return await this.paymentRepository.find({ skip: page * count, take: count, order: { createAt: "DESC" } });
  }


  async getUserPayment(user: UserEntity, page: number, count: number): Promise<PaymentEntity[]> {
    return await this.paymentRepository.find({ where: { user: { id: user.id } }, order: { createAt: "DESC" }, skip: page * count, take: count });
  }


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
      switch (event) {
        case NotchPayPaymentEvent.PAYMENT_COMPLETE:
          expectedPayment.user.walletAmount += expectedPayment.amount;
          this.userEntityRepository.save(expectedPayment.user);
          if (expectedPayment.user.notificationId) {
            // this.firebaseService.sendOneNotification({
            //   notification: {
            //     title: expectedPayment.user.lang === "en" ? "Your recharge was successful" : "Votre recharge a réussi",
            //     body: expectedPayment.user.lang === "en" ? `${expectedPayment.user.lastName ?? ""} ${expectedPayment.user.firstName}, your top-up of ${expectedPayment.amount} XAF was successful` : `${expectedPayment.user.lastName ?? ""} ${expectedPayment.user.firstName} votre recharge de ${expectedPayment.amount} XAF a réussi`,
            //   }, token: expectedPayment.user.notificationId,
            //   data: {
            //     "type": NotificationTypeEnum.WALLET
            //   }
            // });
          }
          break;
        case NotchPayPaymentEvent.TRANSFERT_COMPLETE:
          if (expectedPayment.user.notificationId) {
            // this.firebaseService.sendOneNotification({
            //   notification: {
            //     title: expectedPayment.user.lang === "en" ? "Withdrawal completed successfully" : "Retrait effectué avec succès",
            //     body: expectedPayment.user.lang === "en" ? `${expectedPayment.user.lastName ?? ""} ${expectedPayment.user.firstName}, your withdrawal has been successfully completed` : `${expectedPayment.user.lastName ?? ""} ${expectedPayment.user.firstName} votre retrait a été effectué avec succès`,
            //   }, token: expectedPayment.user.notificationId,
            //   data: {
            //     "type": NotificationTypeEnum.WALLET
            //   }
            // });
          }
          this.userEntityRepository.save(expectedPayment.user);
          break;
        case NotchPayPaymentEvent.TRANSFERT_ECHOUE:
          if (expectedPayment.user.notificationId) {
            // this.firebaseService.sendOneNotification({
            //   notification: {
            //     title: expectedPayment.user.lang === "en" ? "Your withdrawal failed" : "Votre retrait a échoué",
            //     body: expectedPayment.user.lang === "en" ? `${expectedPayment.user.lastName ?? ""} ${expectedPayment.user.firstName}, your withdrawal of ${expectedPayment.amount} XAF has failed` : `${expectedPayment.user.lastName ?? ""} ${expectedPayment.user.firstName} votre retrait de ${expectedPayment.amount} XAF a échoué`,
            //   }, token: expectedPayment.user.notificationId,
            //   data: {
            //     "type": NotificationTypeEnum.WALLET
            //   }
            // });
          }
          expectedPayment.user.walletAmount += expectedPayment.amount;
          this.userEntityRepository.save(expectedPayment.user);
          break;
        case NotchPayPaymentEvent.PAYMENT_ECHOUE:
          if (expectedPayment.user.notificationId) {
            // this.firebaseService.sendOneNotification({
            //   notification: {
            //     title: expectedPayment.user.lang === "en" ? "Your top-up failed" : "Votre recharge a échoué",
            //     body: expectedPayment.user.lang === "en" ? `${expectedPayment.user.lastName ?? ""} ${expectedPayment.user.firstName}, your top-up of ${expectedPayment.amount} XAF has failed` : `${expectedPayment.user.lastName ?? ""} ${expectedPayment.user.firstName} votre recharge de ${expectedPayment.amount} XAF a échoué`,
            //   }, token: expectedPayment.user.notificationId,
            //   data: {
            //     "type": NotificationTypeEnum.WALLET
            //   }
            // });
          }
          break;
        case NotchPayPaymentEvent.PAYMENT_REMBOURSE_AU_CLIENT:
          expectedPayment.user.walletAmount -= expectedPayment.amount;
          this.userEntityRepository.save(expectedPayment.user);
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

  getReservationAmount(): number {
    return this.configService.get<number>('TICKET_RESERVATION_PERCENT');
  }

  async findOne(id: number): Promise<PaymentEntity> {
    return await this.paymentRepository.findOneBy({ id: id });
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
