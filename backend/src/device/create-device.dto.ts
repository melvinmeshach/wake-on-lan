import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateDeviceDto {
    @IsString()
    @Matches(/^([0-9A-F]{2}:){5}([0-9A-F]{2})$/i, {
        message: 'Invalid MAC address format',
    })
    macAddress: string;

    @IsString()
    customId?: string;

    @IsString()
    ipAddress?: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}