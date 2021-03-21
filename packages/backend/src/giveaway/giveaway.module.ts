import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TwitchApiRepository } from 'src/shared/twitch-api.repository';
import { UserModule } from 'src/user/user.module';
import { GiveawayModel, GiveawaySchema } from './db/giveaway.model';
import { GiveawayRepository } from './db/giveaway.repository';
import { GiveawayController } from './giveaway.controller';
import { GiveawayService } from './giveaway.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: GiveawayModel.name, schema: GiveawaySchema },
    ]),
  ],
  controllers: [GiveawayController],
  providers: [GiveawayService, GiveawayRepository, TwitchApiRepository],
})
export class GiveawayModule {}
