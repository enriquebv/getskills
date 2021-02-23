import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenRepository } from './db/refresh-token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenSchema, RefreshTokenModel } from './db/refresh-token.model';
import { TwitchApiRepository } from 'src/shared/twitch-api.repository';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      })
    }),
    MongooseModule.forFeature([
      { name: RefreshTokenModel.name, schema: RefreshTokenSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenRepository, TwitchApiRepository],
})
export class AuthModule { }