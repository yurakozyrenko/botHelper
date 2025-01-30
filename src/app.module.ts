import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BotModule } from './bot/bot.module';
import { BotHandlerModule } from './bot-handler/bot-handler.module';
import config from './configuration/config';
import { UpdatesModule } from './updates/updates.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] }), UpdatesModule, BotModule, BotHandlerModule],
})
export class AppModule {}
