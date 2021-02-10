import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Imports
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule],
})
export class AppModule {}
