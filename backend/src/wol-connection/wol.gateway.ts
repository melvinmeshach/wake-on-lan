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

  sendStatus(taskId: string, data: DeviceStatusDto) {
    this.server.to(taskId).emit('status', { taskId, ...data });
  }

  handleConnection(socket: any) {
    socket.on('subscribe', (taskId: string) => {
      socket.join(taskId);
    });
  }
}
