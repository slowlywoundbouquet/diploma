import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SupportService } from './support.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private supportService: SupportService) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }

  sendMessage() {
    this.server.sockets.emit('receiveMessage', {
      text: 'text',
      author: 'author',
    });
  }
}
