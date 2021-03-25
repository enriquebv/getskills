import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GiveawayModule } from 'src/giveaway/giveaway.module';
import {
  TwitchAppAccessTokenModel,
  TwitchAppAccessTokensSchema,
} from './db/twitch-app-access-token.model';
import {
  TwitchWebhookEventModel,
  TwitchWebhookEventSchema,
} from './db/twitch-webhook-events.model';
import { TwitchRepository } from './db/twitch.repository';
import { TwitchApiRepository } from './twitch-api.repository';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';
@Module({
  imports: [
    forwardRef(() => GiveawayModule),
    MongooseModule.forFeature([
      {
        name: TwitchAppAccessTokenModel.name,
        schema: TwitchAppAccessTokensSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: TwitchWebhookEventModel.name,
        schema: TwitchWebhookEventSchema,
      },
    ]),
  ],
  controllers: [TwitchController],
  providers: [TwitchService, TwitchApiRepository, TwitchRepository],
  exports: [TwitchApiRepository, TwitchService],
})
export class TwitchModule {}
