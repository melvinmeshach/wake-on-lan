import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Auth0UserInfoService } from './auth0-userinfo.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@auth/jwt.strategy';
import { UserModule } from '@user/user.module';
import { JwtWithUserInfoGuard } from './jwt-auth.guard';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  providers: [
    JwtStrategy,
    Auth0UserInfoService,
    JwtWithUserInfoGuard,
  ],
  exports: [
    PassportModule,
    Auth0UserInfoService,
    JwtWithUserInfoGuard,
  ],
})
@Global()
export class AuthModule { }