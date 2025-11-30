// wol.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DeviceStatusDto } from './wake-device.dto';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class WolGateway {
  @WebSocketServer()
  server: Server;

  sendStatus(statusSocketChannel: string, data: DeviceStatusDto) {
    this.server.to(statusSocketChannel).emit('status', { statusSocketChannel, ...data });
  }

  handleConnection(socket: any) {
    socket.on('subscribe', (socketChannel: string) => {
      socket.join(socketChannel);
    });
  }
}
