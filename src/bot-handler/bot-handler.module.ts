import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { BotHandlerService } from './bot-handler.service';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [BotModule, HttpModule, ScheduleModule.forRoot()],
  providers: [BotHandlerService],
  exports: [BotHandlerService],
})
export class BotHandlerModule {}
