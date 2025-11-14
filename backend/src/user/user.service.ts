import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getDevices(): string {
    return 'User Devices';
  }

  async createUserFromAuth0Payload(payload: any) {
    if (!payload?.sub) {
      throw new Error('Auth payload missing sub (auth0 id)');
    }

    const auth0Id = payload.sub;
    const data = {
      email: payload.email ?? null,
      name: payload.name ?? null,
      picture: payload.picture ?? null,
    };

    const user = await this.prisma.user.upsert({
      where: { auth0Id },
      update: { ...data },
      create: { auth0Id, ...data },
    });

    return user;
  }
}