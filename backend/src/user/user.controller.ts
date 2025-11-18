import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtWithUserInfoGuard } from '@auth/jwt-auth.guard';
import { UserService } from '@user/user.service';
import { AuthUser } from '@auth/user.decorator';

@Controller('user')
@UseGuards(JwtWithUserInfoGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@AuthUser() user) {
    console.log('Getting profile for auth user: ', user);
    try {
      if (!user?.sub) {
        console.log('Auth user missing sub field: ', user);
        throw new Error('Auth user missing sub (auth0 id)');
      }
      const auth0Id = user.sub;
      const currentUser = await this.userService.getUserByAuth0Id(auth0Id);
      if (!currentUser) {
        console.log('User not found for auth0Id: ', auth0Id);
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.log('Error getting profile in controller: ', error);
      throw error;
    }
  }
}