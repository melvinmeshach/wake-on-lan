import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getDevices(): string {
    return 'User Devices';
  }
  async createOrUpdateUser(userData: any) {
    console.log('Creating/updating user with data: ', userData);
  
    try{
  if (!userData?.sub)
      throw new Error('Auth payload missing sub (auth0 id)');


      const auth0Id = userData.sub;
      const createUserData: UserEntity = new UserEntity({
        auth0Id: userData.sub,
        email: userData.email ?? null,
        name: userData.name ?? null,
        picture: userData.picture ?? null,
        updatedAt: new Date(),
      });
      
      const user = await this.userRepository.update(auth0Id, createUserData);
      return user;
    }
    catch( e )
    {
      console.log('Error creating user in service: ', e);
      return null;
    }
  }
  // async createUserFromAuth0Payload(payload: any) {
  //   console.log("Auth0 payload: ", payload)
  //   if (!payload?.sub) {
  //     throw new Error('Auth payload missing sub (auth0 id)');
  //   }
  //   const auth0Id = payload.sub;
  //   const data = {
  //     email: payload.email ?? null,
  //     name: payload.name ?? null,
  //     picture: payload.picture ?? null,
  //   };

  //   const user = await this.prisma.user.upsert({
  //     where: { auth0Id },
  //     update: { ...data },
  //     create: { auth0Id, ...data },
  //   });

  //   return user;
  // }
}