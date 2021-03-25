import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TwitchAppAccessTokensDocument,
  TwitchAppAccessTokenModel,
} from './twitch-app-access-token.model';
import { BaseRepository } from 'src/shared/base.repository';
import {
  TwitchWebhookEventDocument,
  TwitchWebhookEventModel,
} from './twitch-webhook-events.model';

interface SaveTokenOptions {
  token: string;
  expiresIn: number;
  expiresAt: Date;
  scopes: string[];
  type: string;
}

@Injectable()
export class TwitchRepository extends BaseRepository {
  constructor(
    @InjectModel(TwitchAppAccessTokenModel.name)
    private twitchAppAccessTokensModel: Model<TwitchAppAccessTokensDocument>,
    @InjectModel(TwitchWebhookEventModel.name)
    private twitchWebhookEventModel: Model<TwitchWebhookEventDocument>,
  ) {
    super(twitchAppAccessTokensModel);
  }

  getLastToken() {
    return this.twitchAppAccessTokensModel.findOne().sort('-created_at');
  }

  saveToken(options: SaveTokenOptions) {
    return new this.twitchAppAccessTokensModel(options).save();
  }

  checkStoredEvent(eventId: string) {
    return this.twitchWebhookEventModel.findOne({ eventId });
  }

  storeEventId(eventId: string) {
    return new this.twitchWebhookEventModel({ eventId }).save();
  }
}
