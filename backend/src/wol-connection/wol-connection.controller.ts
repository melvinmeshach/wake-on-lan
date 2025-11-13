import { Controller, Get, UseGuards } from '@nestjs/common';
import { WOLConnectionService } from '@wol/wol-connection.service';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

@Controller('wol-connection')
//@UseGuards(JwtAuthGuard)
export class WOLConnectionController {
  constructor(private readonly nasConnectionService: WOLConnectionService) {}

  @Get()
  getStatus(): string {
    return this.nasConnectionService.getStatus();
  }
}
