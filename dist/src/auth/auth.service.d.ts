import { UserEntity } from 'src/user/entites/user.entity';
import { Repository } from 'typeorm';
import { SocketService } from 'src/socket/socket.service';
import { UserLoginStatusEnum } from 'src/enum/user.enum';
import { JwtService } from '@nestjs/jwt';
import { LoginCredentialsDto } from 'src/user/dto/login-credentials.dto';
import { UserSubscribeDto } from 'src/user/dto/User-subscribe.dto';
import { UserRoleEnum } from 'src/enum/user-role.enum';
import { AuthLoginEntity } from './entities/auth-login.entity';
import { UserLangEnum } from 'src/enum/user-lang.enum';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly authLoginRepository;
    private readonly userRepository;
    private readonly socketService;
    private readonly jwtService;
    private readonly configService;
    constructor(authLoginRepository: Repository<AuthLoginEntity>, userRepository: Repository<UserEntity>, socketService: SocketService, jwtService: JwtService, configService: ConfigService);
    create(userData: UserSubscribeDto, next?: string): Promise<{
        user: UserEntity;
        status: string;
    }>;
    login(loginCredentialsDto: LoginCredentialsDto): Promise<{
        status: UserLoginStatusEnum;
        user: {
            id: string;
            userName: string;
            email: string;
            firstName: string;
            lastName: string;
            role: UserRoleEnum;
            lang: UserLangEnum;
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
            authLogin: AuthLoginEntity;
            createAt: Date;
            updateAt: Date;
            deleteAt: Date;
        };
        access_token: string;
        refresh_token: string;
    } | {
        status: UserLoginStatusEnum;
        user?: undefined;
        access_token?: undefined;
        refresh_token?: undefined;
    }>;
    private generateUserName;
    getTokens(payload: any): Promise<string[]>;
    refreshTokens(user: UserEntity): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    resetPassword(user: UserEntity, newPassword: string): Promise<{
        status: string;
    }>;
}
