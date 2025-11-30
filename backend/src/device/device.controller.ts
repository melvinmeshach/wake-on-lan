import { Body, Param, Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';

import { JwtWithUserInfoGuard } from '@auth/jwt-auth.guard';
import { DeviceService } from './device.service';
import { AuthUser } from '@auth/user.decorator';
import { CreateDeviceDto } from './create-device.dto';
import { WOLConnectionService } from '@wol/wol-connection.service';
import { DeviceEntity } from './device.entity';

@Controller('device')
@UseGuards(JwtWithUserInfoGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService, private readonly wolService: WOLConnectionService) {}
    @Get()
    async getDevices(@AuthUser() user: any) {
      const devices: DeviceEntity[] = await this.deviceService.getDevicesByUserId(user.sub);
      this.wolService.checkAndSendDeviceStatuses(devices);
      return devices;
    }
    @Post()
    createDevice(
      @AuthUser() user: any,
      @Body() createDeviceDto: CreateDeviceDto,){
        return this.deviceService.createDevice(user.sub, createDeviceDto)
    }
    @Delete(":deviceId")
    deleteDevice(
      @AuthUser() user: any,
      @Param('deviceId') deviceId: string,){
        return this.deviceService.deleteDevice(deviceId)
    }
}
