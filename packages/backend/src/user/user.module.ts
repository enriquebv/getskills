import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserModel } from './db/user.model';
import { TwitchApiRepository } from 'src/shared/twitch-api.repository';
import { UserService } from './user.service';
import { UserRepository } from './db/user.repository';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ConfigModule,
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, TwitchApiRepository],
  exports: [UserRepository],
})
export class UserModule {}
