import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { UserService } from '@user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    console.log('BACKEND_ISSUER_BASE_URL: ', process.env.BACKEND_ISSUER_BASE_URL);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.BACKEND_ISSUER_BASE_URL}.well-known/jwks.json`,
      }),
      audience: process.env.BACKEND_AUDIENCE,
      issuer: process.env.BACKEND_ISSUER_BASE_URL,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    // create or update user record on every validated token
    try {
      await this.userService.createUserFromAuth0Payload(payload);
    } catch (e) {
      // don't block auth if DB upsert fails; log if needed
      console.error('Failed to upsert user from auth payload:', e);
    }

    return payload;
  }
}