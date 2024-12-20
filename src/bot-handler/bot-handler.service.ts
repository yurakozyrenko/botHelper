import { Injectable, Logger, LoggerService } from '@nestjs/common';

import { Actions, messages } from '../bot/bot.constants';
import { BotService } from '../bot/bot.service';

@Injectable()
export class BotHandlerService {
  private userStates: Map<number, string> = new Map();
  private readonly logger: LoggerService = new Logger(BotHandlerService.name);
  private actions: Record<Actions, (text: string, chatId: number) => Promise<void>>;

  constructor(private readonly botService: BotService) {}

  async onModuleInit() {
    this.actions = {
      [Actions.START]: async (text, chatId) => this.handleStart(text, chatId),
    };
  }

  async handleTextMessage(text: string, chatId: number): Promise<void> {
    this.logger.log(`run handleTextMessage ${chatId}`);

    // const userState = this.userStates.get(chatId);

    const actionHandler = this.actions[text as Actions];

    if (!actionHandler) {
      return this.handleDefault(text, chatId);
    }
    return actionHandler(text, chatId);
  }

  async handleStart(text: string, chatId: number): Promise<void> {
    this.logger.log(`run handleStart ${chatId}`);

    await this.botService.sendMessage(chatId, messages.START);
  }

  async handleDefault(text: string, chatId: number): Promise<void> {
    this.logger.log(`run Default ${chatId}`);

    await this.botService.sendMessage(chatId, messages.DEFAULT);

    this.logger.log(`Default successfully ended ${chatId}`);
  }
}
