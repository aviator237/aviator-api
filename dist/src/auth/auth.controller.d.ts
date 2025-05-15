import { AuthService } from './auth.service';
import { LoginCredentialsDto } from 'src/user/dto/login-credentials.dto';
import { UserSubscribeDto } from 'src/user/dto/User-subscribe.dto';
import { UserRoleEnum } from 'src/enum/user-role.enum';
import { UserEntity } from 'src/user/entites/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginData: LoginCredentialsDto): Promise<{
        status: import("../enum/user.enum").UserLoginStatusEnum;
        user: {
            id: string;
            userName: string;
            email: string;
            firstName: string;
            lastName: string;
            role: UserRoleEnum;
            lang: import("../enum/user-lang.enum").UserLangEnum;
            isActive: boolean;
            isBlocked: boolean;
            notchRecipientId: string;
            salt: string;
            phoneNumber: string;
            notificationId: string;
            referalCode: string;
            lastLogin: Date;
            isOnline: boolean;
            walletAmount: number;
            godfather: UserEntity;
            goddaughters: UserEntity[];
            payments: import("../payment/entities/payment.entity").PaymentEntity[];
            bets: import("../player-bet/entities/player-bet.entity").PlayerBetEntity[];
            authLogin: import("./entities/auth-login.entity").AuthLoginEntity;
            createAt: Date;
            updateAt: Date;
            deleteAt: Date;
        };
        access_token: string;
        refresh_token: string;
    } | {
        status: import("../enum/user.enum").UserLoginStatusEnum;
        user?: undefined;
        access_token?: undefined;
        refresh_token?: undefined;
    }>;
    userCreateAccount(userdata: UserSubscribeDto, next?: string): Promise<{
        user: UserEntity;
        status: string;
    }>;
    refresh(user: UserEntity): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
