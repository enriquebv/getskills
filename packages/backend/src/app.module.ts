import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AddSessionFromTokenMiddleware } from './auth/add-session-from-token.middleware';

// Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GiveawayModule } from './giveaway/giveaway.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    GiveawayModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddSessionFromTokenMiddleware).forRoutes('*');
  }
}
