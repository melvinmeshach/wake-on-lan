import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 20,
        jwksUri: `${process.env.BACKEND_ISSUER_BASE_URL}.well-known/jwks.json`,
      }),
      audience: process.env.BACKEND_AUDIENCE,
      issuer: process.env.BACKEND_ISSUER_BASE_URL,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}