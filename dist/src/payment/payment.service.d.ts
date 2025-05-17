import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { UuidService } from 'nestjs-uuid';
import { UserEntity } from 'src/user/entites/user.entity';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { WebhookDataDto } from './dto/webhook.data.dto';
import { CreateTransfertDto } from './dto/create-transfert.dto';
export declare class PaymentService {
    #private;
    private readonly paymentRepository;
    private readonly userEntityRepository;
    private readonly uuidService;
    private readonly configService;
    constructor(paymentRepository: Repository<PaymentEntity>, userEntityRepository: Repository<UserEntity>, uuidService: UuidService, configService: ConfigService);
    createPayment(createPaymentDto: CreatePaymentDto, user: UserEntity): Promise<{
        result: any;
        reference: any;
    }>;
    createTransfer(createTransfertDto: CreateTransfertDto, user: UserEntity): Promise<{
        result: any;
    }>;
    createRecipiant(channel: string, number: string, phone: string, country: string, name: string, description: string, nestReference: string, email: string): Promise<any>;
    initializeTransfert(recipient: string, amount: number, currency: string, description: string): Promise<any>;
    initializeMobilePayment(phone: string, amount: number, currency: string, description: string, nestReference: string): Promise<any>;
    makePayment(reference: string, channel: string, phone: string): Promise<any>;
    findAll(page: number, count: number): Promise<PaymentEntity[]>;
    getUserPayment(user: UserEntity, page: number, count: number): Promise<PaymentEntity[]>;
    handledWebhook(event: string, data: WebhookDataDto): Promise<{
        status: string;
    }>;
    getReservationAmount(): number;
    findOne(id: number): Promise<PaymentEntity>;
    update(id: number, updatePaymentDto: UpdatePaymentDto): string;
    remove(id: number): string;
}
