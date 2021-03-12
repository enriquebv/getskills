import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { HttpException, Injectable } from '@nestjs/common';
import { TwitchUserDto } from './dto/twitch-user.dto';

interface AccessToken {
  accessToken: string;
}

interface UserId {
  twitchId: string;
}

interface RewardId {
  rewardId: string;
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

  async getChannelPointsRewards(config: AccessToken & UserId): Promise<any> {
    const response = await this.helix.get(
      `/channel_points/custom_rewards?broadcaster_id=${config.twitchId}`,
      {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
        },
      },
    );

    return response.data.data;
  }

  async getChannelPointsRedemptions(
    config: AccessToken & UserId & RewardId,
  ): Promise<any> {
    const response = await this.helix.get(
      `/channel_points/custom_rewards/redemptions?broadcaster_id=${config.twitchId}&reward_id=${config.rewardId}&status=FULFILLED`,
      {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
        },
      },
    );

    return response.data.data;
  }
}
