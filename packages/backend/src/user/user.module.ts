import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserModel } from './db/user.model';
import { UserService } from './user.service';
import { UserRepository } from './db/user.repository';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TwitchModule } from 'src/twitch/twitch.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TwitchModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
