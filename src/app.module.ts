import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BotModule } from './bot/bot.module';
import { BotHandlerModule } from './bot-handler/bot-handler.module';
import config from './configuration/config';
import { UpdatesModule } from './updates/updates.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    UpdatesModule,
    BotModule,
    BotHandlerModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => configService.getOrThrow('POSTGRES_DB_SETTINGS'),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
