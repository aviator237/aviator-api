import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entites/user.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from "bcrypt";
import { SocketService } from 'src/socket/socket.service';
import { UserLoginStatusEnum } from 'src/enum/user.enum';
import { JwtService } from '@nestjs/jwt';
import { LoginCredentialsDto } from 'src/user/dto/login-credentials.dto';
import { UserSubscribeDto } from 'src/user/dto/User-subscribe.dto';
import { UserRoleEnum } from 'src/enum/user-role.enum';
import { AuthLoginEntity } from './entities/auth-login.entity';
import { userAccountCreateStatus } from 'src/enum/user-account-create-status.enum';
import { UserLangEnum } from 'src/enum/user-lang.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthLoginEntity)
        private readonly authLoginRepository: Repository<AuthLoginEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly socketService: SocketService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,

    ) { }




    async create(userData: UserSubscribeDto, next?: string) {
        // (userData.firstName ?? "").replace(" ", "");
        // (userData.lastName ?? "").replace(" ", "");
        console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")

        const status: string = userAccountCreateStatus.ACCOUNT_SUCCESSFUL_CREATE;
        // try {

        // // Verifier s'il n'y a pas encore un utilisateur avec cette adresse mail
        // const expectedUserWithEmail: UserEntity = await this.userRepository.findOneBy({ email: userData.email });

        // if (expectedUserWithEmail) {
        //     throw new BadRequestException({ "status": userAccountCreateStatus.DUPLICATE_EMAIL });
        // }

        

        // Verifier s'il n'y a pas encore un utilisateur avec ce numero de telephone
        const expectedUserWithPhone: UserEntity = await this.userRepository.findOneBy({ phoneNumber: userData.phoneNumber });
        if (expectedUserWithPhone) {
            throw new BadRequestException({ "status": userAccountCreateStatus.DUPLICATE_PHONE_NUMBER });
        }

        if (userData.userName) {
            // Verifier s'il n'y a pas encore un utilisateur avec ce nom d'utilisateur
            const expectedUserWithUserName: UserEntity = await this.userRepository.findOneBy({ userName: userData.userName });
            if (expectedUserWithUserName) {
                throw new BadRequestException({ "status": userAccountCreateStatus.DUPLICATE_USER_NAME });
            }
        } else {
            userData.userName = userData.phoneNumber;
        }
        userData.lang ??= UserLangEnum.FRANCAIS;
        const user = this.userRepository.create({
            ...userData
        });

        if (userData.referalCode) {
        const expectedGodfather: UserEntity = await this.userRepository.findOne({where: [{ referalCode: userData.referalCode }, { specialReferalCode: userData.referalCode }]});
        if (expectedGodfather) {
        user.godfather = expectedGodfather;
            // if (expectedGodfather.role == UserRoleEnum.VIP_USER) {
            //     expectedGodfather.
            // }
        }
        }

        // Generer le salt pour associer au mot de passe
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
        user.role = UserRoleEnum.USER;
        user.isActive = true;
        let newUser: UserEntity = await this.userRepository.save(user);

        // Generer un code de parrainage pour l'utilisateur
        const randomCode: string = Math.floor(100 + Math.random() * 90).toString();
        newUser.referalCode = randomCode.toString() + newUser.id.toString().substring(1, 6);
        newUser = await this.userRepository.save(newUser);

        // this.sendConfirmationEmail(user, next);
        return {
            "user": newUser,
            "status": status,
        };
        // } catch (e) {
        //     throw new BadRequestException(e);
        // }
    }



    async login(loginCredentialsDto: LoginCredentialsDto) {
        try {
            const user = await this.userRepository.findOne({ where: [{ phoneNumber: loginCredentialsDto.login }, { userName: loginCredentialsDto.login }] });
            if (user) {
                if (!user.isBlocked) {
                    const password: string = await bcrypt.hash(loginCredentialsDto.password, user.salt);
                    if (password === user.password) {
                        if (user.role == UserRoleEnum.SUPER_ADMIN || user.role == UserRoleEnum.USER) {
                            const payload = {
                                id: user.id,
                                role: user.role
                            };
                            user.lastLogin = new Date();
                            user.isLoggedOut = false; // Réinitialiser le statut de déconnexion
                            const [accessToken, refreshToken] = await this.getTokens(payload)

                            this.userRepository.save(user);
                            const { password, ...rest } = user;

                            const expectedAuthLogin: AuthLoginEntity = await this.authLoginRepository.findOneBy({ user: { id: user.id } });
                            if (expectedAuthLogin) {
                                this.authLoginRepository.delete(expectedAuthLogin.id);
                            }

                            return {
                                "status": UserLoginStatusEnum.LOGIN_SUCCESSFULY,
                                "user": rest,
                                "access_token": accessToken,
                                "refresh_token": refreshToken
                            };
                        } else {
                            throw new UnauthorizedException();
                        }
                    } else {
                        const expectedAuthLogin: AuthLoginEntity = await this.authLoginRepository.findOneBy({ user: { id: user.id } });
                        if (expectedAuthLogin) {
                            if (expectedAuthLogin.loginCount >= parseInt(process.env.MAX_LOGIN_FAIL_COUNT)) {
                                user.isBlocked = true;
                                this.userRepository.save(user);
                                throw new UnauthorizedException(UserLoginStatusEnum.ACCOUNT_BLOCKED, { description: "Your account is blocked due to suspicious activity" });
                            }
                            this.authLoginRepository.increment({ id: expectedAuthLogin.id }, "loginCount", 1);
                        } else {
                            this.authLoginRepository.save({ loginCount: 1, user: user });
                        }
                        return {
                            "status": UserLoginStatusEnum.WRONG_PASSWORD
                        };
                    }
                    // } else {
                    //     return {
                    //         "status": UserLoginStatusEnum.ACCOUNT_NOT_VERIRY
                    //     };
                    // }
                } else {
                    throw new UnauthorizedException(UserLoginStatusEnum.ACCOUNT_BLOCKED, { description: "Your account is blocked due to suspicious activity" });
                }
            } else {
                return {
                    "status": UserLoginStatusEnum.ACCOUNT_DOESNT_EXIST
                };
            }
        } catch (e) {
            console.log(e)
            throw new BadRequestException(e);
        };
    }


    private async generateUserName(userCreateDto: UserSubscribeDto): Promise<string> {
        let userName: string = userCreateDto.lastName.replace(" ", "") + userCreateDto.firstName.replace(" ", "");
        let expectedUser: UserEntity = await this.userRepository.findOneBy({ userName: userName });

        // Si ce nom d'utiisateur existe deja dans la base de données, on recherche un autre en ajoutant un nombre devant
        if (expectedUser) {
            let i: number = 1;
            while (expectedUser) {
                userName = userName + (i++).toString();
                expectedUser = await this.userRepository.findOne({ where: { userName: userName }, withDeleted: true });
            }
        }
        return userName;
    }


    async getTokens(payload) {
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload,
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '60d',
            });
        return [access_token, refresh_token];
    }

    async refreshTokens(user: UserEntity) {
        const [accessToken, refreshToken] = await this.getTokens({ id: user.id, role: user.role });
        return {
            "access_token": accessToken,
            "refresh_token": refreshToken
        };
    }

    async logout(user: UserEntity) {
        try {
            // Mettre à jour le statut de déconnexion de l'utilisateur
            user.isLoggedOut = true;
            await this.userRepository.save(user);

            return {
                "status": "success",
                "message": "Déconnexion réussie"
            };
        } catch (error) {
            throw new BadRequestException("Erreur lors de la déconnexion");
        }
    }

    async resetPassword(user: UserEntity, newPassword: string) {
        try {
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                throw new BadRequestException("New password must be different from the old password");
            }
            user.salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(newPassword, user.salt);
            await this.userRepository.save(user);
            return { status: "ok" };
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

}
