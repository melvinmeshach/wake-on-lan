import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class Auth0UserInfoService {
  constructor(private readonly http: HttpService) {}

  async fetchUserInfo(accessToken: string) {
    const url = `${process.env.BACKEND_ISSUER_BASE_URL}userinfo`;

    const response = await this.http.axiosRef.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }
}
