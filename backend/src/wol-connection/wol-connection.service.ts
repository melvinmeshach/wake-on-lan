import { Injectable } from '@nestjs/common';
import wol from 'wol';
import ping from 'ping';
import { WolGateway } from './wol.gateway';
import { DeviceStatusDto } from './wake-device.dto';
import { DEVICE_STATUS } from './wol.enums';
import { DeviceEntity } from '@device/device.entity';

@Injectable()
export class WOLConnectionService {
  constructor(private gateway: WolGateway) {}

  async startWakeProcess(deviceId:string, mac: string, ip: string) {
    const statusSocketChannel = mac+ip;

    this.runWakeSequence(deviceId, statusSocketChannel, mac, ip);

    return statusSocketChannel;
  }

  async runWakeSequence(deviceId: string, socketChannel: string, mac: string, ip: string) {

    let status: DeviceStatusDto = {
      deviceId: deviceId,
      macAddress: mac,
      ipAddress: ip,
      status: DEVICE_STATUS.STARTING,
    };

    this.gateway.sendStatus(socketChannel, status);

    try {
      await wol.wake(mac);
      this.gateway.sendStatus(socketChannel, {
        ...status,
        status: DEVICE_STATUS.MAGIC_PACKET_SENT,
        message: 'Magic packet sent',
      });
    } catch (e) {
      this.gateway.sendStatus(socketChannel, {
        ...status,
        status: DEVICE_STATUS.ERROR,
        message: e.message,
      });
      return;
    }

    let attempts = 0;
    const maxAttempts = 30;

    do {
      attempts++;
      console.log(`Pinging ${ip}, attempt: ${attempts}`);
      const result = await ping.promise.probe(ip);

      this.gateway.sendStatus(socketChannel, {
        ...status,
        status: DEVICE_STATUS.CHECKING,
        attempt: attempts + 1
      });

      if (result.alive) {
        this.gateway.sendStatus(socketChannel, { ...status, status: DEVICE_STATUS.ONLINE });
        return;
      }

      await new Promise((res) => setTimeout(res, 3000));
    }while (attempts <= maxAttempts);

    this.gateway.sendStatus(socketChannel, { ...status, status: DEVICE_STATUS.OFFLINE });
    return;
  }
  async checkAndSendDeviceStatuses(devices: DeviceEntity[]): Promise<void> {
    for (const device of devices) {
      const mac = device.macAddress;
      const ip = device.ipAddress;
      const deviceId = device.deviceId;
      if (mac && ip) {
        await this.checkAndSendDeviceStatus(deviceId, mac, ip);
      }
    }
    return;
  }
  async checkAndSendDeviceStatus(deviceId:string, mac:string, ip: string): Promise<void> {
    const deviceStatus = await ping.promise.probe(ip);
    let status: DeviceStatusDto = {
      deviceId: deviceId,
      macAddress: mac,
      ipAddress: ip,
      status: DEVICE_STATUS.CHECKING,
    };
    if (deviceStatus.alive) {
      status.status = DEVICE_STATUS.ONLINE;
      status.alive = true;
      status.message = 'Device is online';
    } else {
      status.status = DEVICE_STATUS.OFFLINE;
      status.alive = false;
      status.message = 'Device is offline';
    }
    this.gateway.sendStatus(mac+ip, status);
    return;
  }
}
