import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtWithUserInfoGuard } from '@auth/jwt-auth.guard';
import { DeviceService } from './device.service';

@Controller('device')
//@UseGuards(JwtWithUserInfoGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

    @Post()
    createDevice(): string {
        return 'Device created';
    }
}
