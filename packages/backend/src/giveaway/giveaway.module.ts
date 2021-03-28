import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { TwitchModule } from 'src/twitch/twitch.module';
import { UserModule } from 'src/user/user.module';
import { GiveawayModel, GiveawaySchema } from './db/giveaway.model';
import { GiveawayRepository } from './db/giveaway.repository';
import { GiveawayController } from './giveaway.controller';
import { GiveawayService } from './giveaway.service';

@Module({
  imports: [
    forwardRef(() => TwitchModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: GiveawayModel.name, schema: GiveawaySchema },
    ]),
  ],
  controllers: [GiveawayController],
  providers: [GiveawayService, GiveawayRepository],
  exports: [GiveawayService],
})
export class GiveawayModule {}
