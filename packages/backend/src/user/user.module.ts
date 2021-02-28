import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserModel } from './db/user.model';
import { TwitchApiRepository } from 'src/shared/twitch-api.repository';
import { UserService } from './user.service';
import { UserRepository } from './db/user.repository';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  providers: [UserService, UserRepository, TwitchApiRepository],
  exports: [UserRepository],
})
export class UserModule {}
