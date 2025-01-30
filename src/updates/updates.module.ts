import { Module } from '@nestjs/common';

import { UpdatesController } from './updates.controller';
import { UpdatesService } from './updates.service';
import { BotModule } from '../bot/bot.module';
import { BotHandlerModule } from '../bot-handler/bot-handler.module';

@Module({
  imports: [BotModule, BotHandlerModule],
  controllers: [UpdatesController],
  providers: [UpdatesService],
})
export class UpdatesModule {}
