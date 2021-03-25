import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { HttpException, Injectable } from '@nestjs/common';

// Options
import { CreateCustomRewardOptions } from './dto/create-custom-reward-options.dto';

// Responses
import { TwitchUserDto } from './dto/twitch-user.dto';
import { CreateCustomRewardResponseDto } from './dto/create-custom-reward-response.dto';
import { AppAccessTokenDto } from './dto/app-access-token.dto';

interface AccessToken {
  accessToken: string;
}

interface UserId {
  twitchId: string;
}

interface CreateChannelPoinsWebhookOptions {
  twitchId: string;
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

  async createAppAccessToken(): Promise<AppAccessTokenDto> {
    const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = process.env;
    const scopes = [
      'bits:read',
      'channel:read:redemptions',
      'channel:manage:redemptions',
      'channel:read:subscriptions',
      'channel:edit:commercial',
      'channel:manage:broadcast',
    ].join('%20');
    const endpoint = `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=${scopes}`;
    const response = await axios.post(endpoint);
    return response.data;
  }

  async getSuscriptions(config: AccessToken) {
    const response = await this.helix.get('/eventsub/subscriptions', {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
      },
    });

    return response.data;
  }

  async createChannelPointsWebhook(
    config: AccessToken,
    options: CreateChannelPoinsWebhookOptions,
  ): Promise<any> {
    const { APP_URL, TWITCH_WEBHOOK_SECRET } = process.env;
    const callback = `${APP_URL}/api/twitch/webhook`;
    const body = {
      type: 'channel.channel_points_custom_reward_redemption.add',
      version: '1',
      condition: {
        broadcaster_user_id: options.twitchId,
        reward_id: options.rewardId,
      },
      transport: {
        method: 'webhook',
        callback,
        secret: TWITCH_WEBHOOK_SECRET,
      },
    };
    return (
      await this.helix.post('/eventsub/subscriptions', body, {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
        },
      })
    ).data;
  }
}
