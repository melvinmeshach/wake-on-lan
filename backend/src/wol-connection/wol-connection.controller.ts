import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WOLConnectionService } from '@wol/wol-connection.service';
import { JwtWithUserInfoGuard } from '@auth/jwt-auth.guard';
import { AuthUser } from '@auth/user.decorator';
import { WakeDeviceDto, WakeDeviceResponseDto } from './wake-device.dto';

@Controller('wol-connection')
@UseGuards(JwtWithUserInfoGuard)
export class WOLConnectionController {
  constructor(private readonly wolConnectionService: WOLConnectionService) {}

  @Post("/wake")
  async wakeDevice(
        @AuthUser() user: any,
        @Body() wakeDeviceDto: WakeDeviceDto): Promise<WakeDeviceResponseDto> {
          console.log(`User ${user.sub} requested to wake device with MAC: ${wakeDeviceDto.macAddress} and IP: ${wakeDeviceDto.ipAddress}`);
          const statusSocketChannel = await this.wolConnectionService.startWakeProcess(wakeDeviceDto.deviceId, wakeDeviceDto.macAddress, wakeDeviceDto.ipAddress);
          return { statusSocketChannel };
        }
}
