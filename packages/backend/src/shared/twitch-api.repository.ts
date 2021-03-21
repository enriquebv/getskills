import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { HttpException, Injectable } from '@nestjs/common';

// Options
import { CreateCustomRewardOptions } from './dto/create-custom-reward-options.dto';

// Responses
import { TwitchUserDto } from './dto/twitch-user.dto';
import { CreateCustomRewardResponseDto } from './dto/create-custom-reward-response.dto';

interface AccessToken {
  accessToken: string;
}

interface UserId {
  twitchId: string;
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

  async createCustomReward(
    config: AccessToken & UserId,
    options: CreateCustomRewardOptions,
  ): Promise<CreateCustomRewardResponseDto> {
    const response = await this.helix.post(
      `/channel_points/custom_rewards?broadcaster_id=${config.twitchId}`,
      options,
      {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
        },
      },
    );

    return response.data.data[0];
  }

  async deleteCustomReward(config: AccessToken & UserId, id: string) {
    const response = await this.helix.delete(
      `/channel_points/custom_rewards?broadcaster_id=${config.twitchId}&id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
        },
      },
    );

    return response;
  }
}
