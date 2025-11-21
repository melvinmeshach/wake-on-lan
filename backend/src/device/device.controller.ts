import { Body, Param, Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';

import { JwtWithUserInfoGuard } from '@auth/jwt-auth.guard';
import { DeviceService } from './device.service';
import { AuthUser } from '@auth/user.decorator';
import { CreateDeviceDto } from './create-device.dto';

@Controller('device')
@UseGuards(JwtWithUserInfoGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
    @Get()
    getDevices(@AuthUser() user: any) {
      return this.deviceService.getDevicesByUserId(user.sub);
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
