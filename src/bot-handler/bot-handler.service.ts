import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';

import { Actions, fileUrl, messages } from '../bot/bot.constants';
import { BotService } from '../bot/bot.service';

@Injectable()
export class BotHandlerService {
  private readonly logger: LoggerService = new Logger(BotHandlerService.name);
  private actions: Record<Actions, (text: string, chatId: number) => Promise<void>>;

  constructor(
    private readonly botService: BotService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    this.actions = {
      [Actions.START]: async (text, chatId) => this.handleStart(chatId),
      [Actions.PRICE]: async (text, chatId) => this.handlePrice(chatId),
    };
  }

  async handleTextMessage(text: string, chatId: number): Promise<void> {
    this.logger.log(`run handleTextMessage ${chatId}`);

    const actionHandler = this.actions[text as Actions];

    if (!actionHandler) {
      return this.handleDefault(chatId);
    }
    return actionHandler(text, chatId);
  }

  async handleStart(chatId: number): Promise<void> {
    this.logger.log(`run handleStart ${chatId}`);

    await this.botService.sendMessage(chatId, messages.START);
  }

  async handlePrice(chatId: number): Promise<void> {
    this.logger.log(`run handlePrice ${chatId}`);

    const priceMessage = await this.getBitcoinPriceMessage();

    await this.botService.sendMessage(chatId, priceMessage);
  }

  async handleDefault(chatId: number): Promise<void> {
    this.logger.log(`run Default ${chatId}`);

    await this.botService.sendMessage(chatId, messages.DEFAULT);

    this.logger.log(`Default successfully ended ${chatId}`);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async fetchBitcoinPrice() {
    this.logger.log('Fetching BTC price...');
    const priceMessage = await this.getBitcoinPriceMessage();
    await this.botService.sendMessage(412620176, `Автообновление: ${priceMessage}`);
  }

  async getBitcoinPriceMessage(): Promise<string> {
    try {
      const { data } = await lastValueFrom(this.httpService.get(fileUrl));
      const price = parseFloat(data.price).toFixed(2);
      this.logger.log(`Текущий курс BTC: $${price}`);
      return `Текущий курс BTC: $${price}`;
    } catch (error) {
      this.logger.error('Ошибка при получении цены BTC', error);
      return 'Не удалось получить курс BTC.';
    }
  }
}
