import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async getUserByAuth0Id(auth0Id: string): Promise<UserEntity | null> {
    console.log('Fetching user by auth0Id: ', auth0Id);
    try{
      const user: UserEntity | null = await this.userRepository.getUserByAuth0Id(auth0Id);
      if(!user){
        console.log('No user found with auth0Id: ', auth0Id);
        return null;
      }
      return user;
    } catch (error) {
        console.log('Error in service fetching user by auth0Id: ', error);
        throw error;
    }
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