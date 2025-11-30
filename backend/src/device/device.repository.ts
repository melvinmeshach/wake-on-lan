import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { DeviceEntity } from './device.entity';

@Injectable()
export class DeviceRepository {
  constructor(
    @Inject() private readonly prismaService: PrismaService
  ) {}
  async create(device: DeviceEntity): Promise<DeviceEntity> {

    try{
        const createdDevice = await this.prismaService.device.create({
            data: device
        });
        return new DeviceEntity(createdDevice);
    } catch (error) {
        console.log('Error creating device in repository: ', error);
        throw error;
    }
  }
  async findDevicesByUserId(userId: string): Promise<DeviceEntity[]> {

    try{
        const foundDevices = await this.prismaService.device.findMany({
            where: { userId }
        });
        return foundDevices.map(device => new DeviceEntity(device));
    } catch (error) {
        console.log('Error finding devices in repository: ', error);
        throw error;
    }
  }
  async findByDeviceId(deviceId: string): Promise<DeviceEntity | null> {

    try{
        const foundDevice = await this.prismaService.device.findUnique({
            where: { deviceId }
        });
        return foundDevice ? new DeviceEntity(foundDevice) : null;
    } catch (error) {
        console.log('Error finding device in repository: ', error);
        throw error;
    }
  }
  async update(deviceId: string, device: DeviceEntity): Promise<DeviceEntity> {

    try{
        const updatedDevice = await this.prismaService.device.update({
            data: device, 
            where: { deviceId }
        });
        return new DeviceEntity(updatedDevice);
    } catch (error) {
        console.log('Error updating device in repository: ', error);
        throw error;
    }
  }
  async delete(deviceId: string): Promise<boolean> {

    try{
        await this.prismaService.device.delete({
            where: { deviceId }
        });
        return true
    } catch (error) {
        console.log('Error deleting device in repository: ', error);
        throw error;
    }
  }
}