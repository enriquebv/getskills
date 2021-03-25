import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GiveawayService } from 'src/giveaway/giveaway.service';
import { TwitchAppAccessTokenModel } from './db/twitch-app-access-token.model';
import { TwitchRepository } from './db/twitch.repository';
import { TwitchApiRepository } from './twitch-api.repository';

interface CreateChannelPointsWebhookOptions {
  rewardId: string;
  twitchId: string;
}

interface EventId {
  eventId: string;
}

interface ProcessChannelPointsRewardWehbookOptions {
  broadcasterId: string;
  userInfo: {
    id: string;
    user: string;
    name: string;
  };
  rewardId: string;
}

@Injectable()
export class TwitchService {
  constructor(
    private readonly twitchApiRepository: TwitchApiRepository,
    private readonly twitchRepository: TwitchRepository,
    @Inject(forwardRef(() => GiveawayService))
    private readonly giveawayService: GiveawayService,
  ) {}

  async createChannelPointsWebhook(options: CreateChannelPointsWebhookOptions) {
    const token = await this.getValidAppToken();

    return this.twitchApiRepository.createChannelPointsWebhook(
      {
        accessToken: token,
      },
      options,
    );
  }

  async getWebhookSubscriptions() {
    const token = await this.getValidAppToken();

    return this.twitchApiRepository.getSuscriptions({
      accessToken: token,
    });
  }

  async createAppToken() {
    const appAccessToken = await this.twitchApiRepository.createAppAccessToken();
    const date = new Date();

    date.setSeconds(date.getSeconds() + appAccessToken.expires_in);

    return this.twitchRepository.saveToken({
      token: appAccessToken.access_token,
      expiresIn: appAccessToken.expires_in,
      scopes: appAccessToken.scope,
      type: appAccessToken.token_type,
      expiresAt: date,
    });
  }

  async getValidAppToken(): Promise<string> {
    let storedToken = await this.twitchRepository.getLastToken();

    if (
      !storedToken ||
      storedToken.revoked ||
      this.tokenIsExpired(storedToken)
    ) {
      storedToken = await this.createAppToken();
    }

    return storedToken.token;
  }

  tokenIsExpired(storedToken: TwitchAppAccessTokenModel) {
    const now = new Date().valueOf();
    const expireDate = new Date(storedToken.expiresAt).valueOf();

    return now >= expireDate;
  }

  async isEventStored(eventId: string): Promise<boolean> {
    const storedEvent = await this.twitchRepository.checkStoredEvent(eventId);

    if (!storedEvent) {
      await this.twitchRepository.storeEventId(eventId);
      return false;
    }

    return true;
  }

  async processChannelPointsRewardWehbook(
    options: EventId & ProcessChannelPointsRewardWehbookOptions,
  ) {
    const isEventStored = await this.isEventStored(options.eventId);

    if (isEventStored) return;

    return this.giveawayService.addChannelPointsGiveawayParticipant(options);
  }
}
