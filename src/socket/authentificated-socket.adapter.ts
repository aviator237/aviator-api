import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";
// import { Server } from "http";

export class AuthentificatedSocketAdapter extends IoAdapter {
    constructor(private app: INestApplicationContext) {
        super(app);
    }
    // private adapterConstructor: ReturnType<typeof createAdapter>;

    createIOServer(port: number, options?: ServerOptions) {
        const server: Server = super.createIOServer(port, options);
        server.use(async (socket: any, next) => {
            const tokenPayload: string = socket.handshake?.auth?.token;
       if (!tokenPayload) {
        return next(new Error("Token not provided"));
       }

       const [method, token] = tokenPayload.split(" ");

       if (method !== "Bearer") {
        return next(
            new Error("Invalide authentification method, Only Bearer is supported."),
        );
       }

       try {
        socket.user = {};

        return next();
       } catch(error: any) {
        return next(new Error("Authentification error"));
       }
        });
        return server;
    }
}