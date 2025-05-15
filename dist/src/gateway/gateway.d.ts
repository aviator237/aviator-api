import { Socket } from "socket.io";
export declare class myGateWay {
    onNewMessage(client: Socket, body: any): string;
}
