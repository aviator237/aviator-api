import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { UserEntity } from "src/user/entites/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;
export declare const AuthWsMiddleware: (jwtService: JwtService, configService: ConfigService, userService: UserService, userEntityRepository: Repository<UserEntity>) => SocketMiddleware;
export {};
