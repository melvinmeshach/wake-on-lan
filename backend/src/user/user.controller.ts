import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { UserService } from '@user/user.service';
import { AuthUser } from '@auth/user.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getProfile(@AuthUser() user) {
        return user;
    }

    @Get('devices')
    getDevices(): string {
        return this.userService.getDevices();
    }
}
