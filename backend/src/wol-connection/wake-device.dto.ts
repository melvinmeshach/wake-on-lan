import { IsBoolean, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class WakeDeviceDto {
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
    socketChannel: string;
}
export class DeviceStatusDto {
    @IsString()
    @IsNotEmpty()
    macAddress!: string;

    @IsString()
    @IsNotEmpty()
    ipAddress!: string;

    @IsString()
    @IsNotEmpty()
    event: string;

    @IsNumber()
    attempt?: number;

    @IsBoolean()
    alive?: boolean;

    @IsString()
    message?: string;
}