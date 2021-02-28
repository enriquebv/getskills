import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { HttpException, Injectable } from '@nestjs/common';
import { TwitchUserDto } from './dto/twitch-user.dto';

interface AccessToken {
  accessToken: string;
}

export class TwitchApiException extends HttpException {
  protected originalError: AxiosError;

  constructor(message: string, status: number, originalError: AxiosError) {
    super(message, status);
    this.originalError = originalError;
  }
}

@Injectable()
export class TwitchApiRepository {
  private helix: AxiosInstance = null;

  constructor() {
    this.helix = axios.create({
      baseURL: `https://api.twitch.tv/helix/`,
      headers: {
        'Client-Id': process.env.TWITCH_CLIENT_ID,
      },
    });

    this.setCustomExceptions(this.helix);
  }

  setCustomExceptions(instance: AxiosInstance) {
    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        throw new TwitchApiException(
          error.response?.data?.message || 'Without error message.',
          error.response.status,
          error.response,
        );
      },
    );
  }

  async getUser(config: AccessToken): Promise<TwitchUserDto> {
    const response = await this.helix.get('users', {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
      },
    });
    const [user] = response.data.data;

    return user;
  }
}
