import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}
    createDevice(device, userId: string) {
        return this.prisma.device.create({
            data:{
                macAddress: '00:1A:2B:3C:4D:5E',
                userId: 'some-user-id'
        }});
    }
}