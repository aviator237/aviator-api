import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Socket } from "socket.io";
import { payloadInterface } from "src/token-auth/interface/payload.interface";
import { JwtStrategy } from "src/token-auth/strategy/passport-jwt.strategy";
import { UserEntity } from "src/user/entites/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

type SocketMiddleware = (
    socket: Socket,
    next: (err?: Error) => void,
) => void;

export const AuthWsMiddleware = (
    jwtService: JwtService,
    configService: ConfigService,
    userService: UserService,
    userEntityRepository: Repository<UserEntity>,
): SocketMiddleware => {
    return async (socket: Socket, next) => {
        try {
            const token = socket.handshake?.auth?.token;

            if (!token) {
                throw new Error("Authorization token is missing");
            }

            let payload: payloadInterface | null = null;

            try {
                payload = await jwtService.verifyAsync<payloadInterface>(token);
            } catch (error) {
                throw new Error("Authorization token is invalid");
            }

            const strategy = new JwtStrategy(configService, userEntityRepository);
            const user = await strategy.validate(payload);

            if (!user) {
                throw new Error("User does not exist");
            }

            socket = Object.assign(socket, {
                user: user!,
            });
            next();
        } catch (error) {
            next(new Error("Unauthorized"));
        }
    };
};