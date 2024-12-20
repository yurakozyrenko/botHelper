import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UpdatesController } from './updates.controller';
import { UpdatesService } from './updates.service';
import { BotModule } from '../bot/bot.module';
import { BotHandlerModule } from '../bot-handler/bot-handler.module';
import { User } from '../users/entity/users.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BotModule, BotHandlerModule, UsersModule],
  controllers: [UpdatesController],
  providers: [UpdatesService],
})
export class UpdatesModule {}
