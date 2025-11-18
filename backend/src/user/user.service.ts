import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  getDevices(): string {
    return 'User Devices';
  }
  async createOrUpdateUser(userData: any) {
    console.log('Creating/updating user with data: ', userData);

    try {
      if (!userData?.sub){
        console.log('User data missing sub field: ', userData);
        throw new Error('Auth0 payload missing sub (auth0 id)');
      }

      const auth0Id = userData.sub;
      const createUserData: UserEntity = new UserEntity({
        auth0Id: userData.sub,
        email: userData.email ?? null,
        name: userData.name ?? null,
        picture: userData.picture ?? null,
        updatedAt: new Date(),
      });

      const user = await this.userRepository.upsert(auth0Id, createUserData);
      return user;
    }
    catch (e) {
      console.log('Error creating user in service: ', e);
      throw new Error("Error creating user in service:" , e);
    }
  }
}