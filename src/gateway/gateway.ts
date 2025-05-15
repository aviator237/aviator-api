import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway(3007)
export class myGateWay {
    @SubscribeMessage("newMessage")
    onNewMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() body: any) {
            console.log(client.id)

    console.log(body)
    // emit("")
    return "Oui j'ai recu";
}
}