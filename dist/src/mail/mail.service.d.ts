import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from 'src/user/entites/user.entity';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserConfirmationEmail(user: UserEntity, token: string, next?: string): Promise<void>;
    sendUserLoginInfoEmail(user: UserEntity, password: string): Promise<void>;
}
