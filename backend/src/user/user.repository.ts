import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @Inject() private readonly prismaService: PrismaService
  ) {}
  async upsert(auth0Id: string, user:UserEntity): Promise<UserEntity> {

    try{
        const createdUser = await this.prismaService.user.upsert({
            where: { auth0Id },
            update: user,
            create: user,
            });
        return new UserEntity(createdUser);
    } catch (error) {
        console.log('Error creating user in repository: ', error);
        throw error;
    }
  }
  async getUserByAuth0Id(auth0Id: string): Promise<UserEntity | null> {
    try{
      const user =  await this.prismaService.user.findUnique({
          where: { auth0Id },
      });
      if (!user) {
          return null;
      }
      return new UserEntity(user);
    } catch (error) {
        console.log('Error fetching user by auth0Id in repository: ', error);
        throw error;
    }
  }
}