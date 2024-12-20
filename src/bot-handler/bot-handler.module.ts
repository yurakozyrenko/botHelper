import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BotHandlerService } from './bot-handler.service';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [BotModule, HttpModule],
  providers: [BotHandlerService],
  exports: [BotHandlerService],
})
export class BotHandlerModule {}
