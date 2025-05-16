
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import * as dotenv from "dotenv";

dotenv.config()

export class RedisIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>;

    async connectToRedis(): Promise<void> {
        console.log(process.env.MY_REDIS_SERVER_URL)
        // const password = process.env.MY_REDIS_SERVER_PASSWORD;
        const pubClient = createClient({ url: process.env.MY_REDIS_SERVER_URL    });
        // const pubClient = createClient({
        //     username: 'default',
        //     password: 'Ozn6aKlHad0m1jRUikZZ3EHECIt67hR8',
        //     socket: {
        //         host: 'redis-17240.c253.us-central1-1.gce.redns.redis-cloud.com',
        //         port: 17240
        //     }
        // });
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);

        this.adapterConstructor = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: ServerOptions): any {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
