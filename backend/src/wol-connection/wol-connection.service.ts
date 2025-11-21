import { Injectable } from '@nestjs/common';
import wol from 'wol';
import ping from 'ping';
import { WolGateway } from './wol.gateway';
import { DeviceStatusDto } from './wake-device.dto';

@Injectable()
export class WOLConnectionService {
  constructor(private gateway: WolGateway) {}

  async startWakeProcess(mac: string, ip: string) {
    const socketChannel = mac+ip;

    this.runWakeSequence(socketChannel, mac, ip);

    return socketChannel;
  }
  async listenToDeviceStatus() {
  }

  async runWakeSequence(socketChannel: string, mac: string, ip: string) {

    let status: DeviceStatusDto = {
      macAddress: mac,
      ipAddress: ip,
      event: 'starting',
    };

    this.gateway.sendStatus(socketChannel, status);

    try {
      await wol.wake(mac);
      this.gateway.sendStatus(socketChannel, {
        ...status,
        event: 'sent',
        message: 'Magic packet sent',
      });
    } catch (e) {
      this.gateway.sendStatus(socketChannel, {
        ...status,
        event: 'error',
        message: e.message,
      });
      return;
    }

    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      const result = await ping.promise.probe(ip);

      this.gateway.sendStatus(socketChannel, {
        ...status,
        event: 'checking',
        attempt: attempts + 1,
        alive: result.alive,
      });

      if (result.alive) {
        this.gateway.sendStatus(socketChannel, { ...status, event: 'online' });
        return;
      }

      await new Promise((res) => setTimeout(res, 2000));
      attempts++;
    }

    this.gateway.sendStatus(socketChannel, { ...status, event: 'timeout' });
  }
}
