import { Controller, Get, Post, Body } from '@nestjs/common';
import { TwitchService } from './twitch.service';

@Controller('api/twitch')
export class TwitchController {
  constructor(private readonly twitchService: TwitchService) {}

  @Post('webhook')
  async listenWebhook(@Body() body: any) {
    // TODO verificar signature

    if (body.challenge) return body.challenge;

    if (!body.subscription.type) {
      throw new Error('Invalid body.');
    }

    switch (body.subscription.type) {
      case 'channel.channel_points_custom_reward_redemption.add':
        return this.twitchService.processChannelPointsRewardWehbook({
          eventId: body.event.id,
          rewardId: body.event.reward.id,
          userInfo: {
            id: body.event.user_id,
            user: body.event.user_login,
            name: body.event.user_name,
          },
          broadcasterId: body.event.broadcaster_user_id,
        });
      default:
        throw new Error('bad request de tipo');
    }
  }

  @Get('webhook/subscriptions')
  async getWebhookSubscriptions() {
    return this.twitchService.getWebhookSubscriptions();
  }
}
