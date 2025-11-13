import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getDevices(): string {
    return 'User Devices';
  }
}
