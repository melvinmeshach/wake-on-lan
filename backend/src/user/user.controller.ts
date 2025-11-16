import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtWithUserInfoGuard } from '@auth/jwt-auth.guard';
import { UserService } from '@user/user.service';
import { AuthUser } from '@auth/user.decorator';

@Controller('user')
@UseGuards(JwtWithUserInfoGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getProfile(@AuthUser() user) {
    console.log("user: ", user)
    return user;
  }

  @Get('devices')
  getDevices(): string {
    return this.userService.getDevices();
  }

}