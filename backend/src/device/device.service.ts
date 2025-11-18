import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { DeviceEntity } from './device.entity';
import { DeviceRepository } from './device.repository';

@Injectable()
export class DeviceService {
    constructor(private readonly deviceRepository: DeviceRepository) { }

    async createDevice(userId: string, deviceData: any) {
        console.log('Creating device with data: ', deviceData);

        try {
            const createDeviceData: DeviceEntity = new DeviceEntity({
                userId,
                deviceId: uuidv4(),
                macAddress: deviceData.macAddress ?? null,
                customId: deviceData.customId ?? null,
                updatedAt: new Date(),
            });

            const device = await this.deviceRepository.create(createDeviceData);
            return device;
        }
        catch (e) {
            console.log('Error creating device in service: ', e);
            throw new Error("Error creating device in service:", e);
        }
    }
    async getDevicesByUserId(userId: string) {
        console.log('Getting devices for userId: ', userId);

        try {
            const devices: DeviceEntity[] = await this.deviceRepository.findDevicesByUserId(userId);
            return devices;
        }
        catch (e) {
            console.log('Error getting devices in service: ', e);
            throw new Error("Error getting devices in service:", e);
        }
    }
    async updateDevice(deviceData: any) {
        console.log('Updating device with data: ', deviceData);

        try {
            if (!deviceData?.deviceId) {
                console.log('Device data missing deviceId field: ', deviceData);
                throw new Error('Device data missing deviceId');
            }
            const deviceId = deviceData.deviceId;
            const currentDevice: DeviceEntity | null = await this.deviceRepository.findByDeviceId(deviceId);
            if (!currentDevice) {
                throw new Error('Device not found with deviceId: ' + deviceId);
            }
            const updateDeviceData: DeviceEntity = new DeviceEntity({
                ...currentDevice,
                macAddress: deviceData.macAddress ?? currentDevice.macAddress,
                customId: deviceData.customId ?? currentDevice.customId,
                name: deviceData.name ?? currentDevice.name,
                updatedAt: new Date(),
            });

            const device = await this.deviceRepository.update(deviceId, updateDeviceData);
            return device;
        }
        catch (e) {
            console.log('Error updating device in service: ', e);
            throw new Error("Error updating device in service:", e);
        }
    }
    async deleteDevice(deviceId: string) {
        console.log('Deleting device with deviceId: ', deviceId);

        try {
            let isDeleted = await this.deviceRepository.delete(deviceId);
            if (!isDeleted)
                throw new Error('Device not deleted with deviceId: ' + deviceId);

            console.log('Device deleted successfully: ', deviceId);
            return { message: 'Device deleted successfully', deviceId };
        }
        catch (e) {
            console.log('Error deleting device in service: ', e);
            throw new Error("Error deleting device in service:", e);
        }
    }
}