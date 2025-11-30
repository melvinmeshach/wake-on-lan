import { IsBoolean, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { DEVICE_STATUS } from './wol.enums';

export class WakeDeviceDto {
    @IsString()
    @IsNotEmpty()
    deviceId: string;

    @IsString()
    @Matches(/^([0-9A-F]{2}:){5}([0-9A-F]{2})$/i, {
        message: 'Invalid MAC address format',
    })
    macAddress: string;

    @IsString()
    ipAddress: string;

}
export class WakeDeviceResponseDto {
    @IsString()
    @IsNotEmpty()
    statusSocketChannel: string;
}
export class DeviceStatusDto {
    @IsString()
    @IsNotEmpty()
    deviceId!: string;

    @IsString()
    @IsNotEmpty()
    macAddress!: string;

    @IsString()
    @IsNotEmpty()
    ipAddress!: string;

    @IsString()
    @IsNotEmpty()
    status: DEVICE_STATUS;

    @IsNumber()
    attempt?: number;

    @IsBoolean()
    alive?: boolean;

    @IsString()
    message?: string;
}