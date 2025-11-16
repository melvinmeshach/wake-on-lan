import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Auth0UserInfoService } from './auth0-userinfo.service';
import { UserService } from '@user/user.service';

@Injectable()
export class JwtWithUserInfoGuard extends AuthGuard('jwt') {
  constructor(
        private readonly userInfoService: Auth0UserInfoService,
        private readonly userService: UserService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const can = (await super.canActivate(context)) as boolean;
    if (!can) return false;

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No access token provided');

    const accessToken = authHeader.split(' ')[1];

    try {
      const profile = await this.userInfoService.fetchUserInfo(accessToken);

      request.user = {
        ...request.user,
        ...profile,
      };
      console.log('Enriched user info: ', request.user);
      
      try {
        await this.userService.createOrUpdateUser(request.user);
        } catch (err) {
        console.error('Failed to create/update user in guard:', err);
        }

    } catch (err) {
      console.error('Failed to fetch userinfo:', err.message);
      throw new UnauthorizedException('Could not fetch user profile');
    }

    return true;
  }
}
