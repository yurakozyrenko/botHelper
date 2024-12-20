import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Message, Update } from 'node-telegram-bot-api';

import { BotHandlerService } from '../bot-handler/bot-handler.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class UpdatesService {
  private readonly logger: LoggerService = new Logger(UpdatesService.name);

  constructor(
    private readonly botHandlersService: BotHandlerService,
    private readonly userService: UsersService,
  ) {}

  async handleUpdate({ message }: Update) {
    const { from } = message;
    const { id: chatId } = from;
    const chatType = message.chat.type;

    const existingUser = await this.userService.findOneByChatId(chatId);

    const newUserId = existingUser ? existingUser : await this.userService.createUser({ chatId });

    if (newUserId && chatType === 'private') {
      return this.handleMessage(message, chatId);
    }
  }

  async handleMessage(message: Message, chatId: number) {
    const { text } = message;
    this.logger.log(`Update message: ${JSON.stringify(message)}`);
    await this.botHandlersService.handleTextMessage(text, chatId);
  }
}
