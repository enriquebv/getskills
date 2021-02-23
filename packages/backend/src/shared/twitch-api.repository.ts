import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';
import { TwitchUserDto } from './dto/twitch-user.dto';

interface AccessToken {
  accessToken: string
}

@Injectable()
export class TwitchApiRepository {
  private helix: AxiosInstance = null;

  constructor() {
    this.helix = axios.create({
      baseURL: `https://api.twitch.tv/helix/`,
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID
      }
    });
  }

  async getUser(config: AccessToken): Promise<TwitchUserDto> {
    const response = await this.helix.get('users', {
      headers: {
        'Authorization': `Bearer ${config.accessToken}`
      }
    });
    const [user] = response.data.data;

    return user;
  }
}