import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import * as crypto from 'crypto';

import { Actions, fileUrlBinance, messages } from '../bot/bot.constants';
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

    const priceMessage = await this.getBitcoinBinancePriceMessage();

    await this.botService.sendMessage(chatId, priceMessage);
  }

  async handleDefault(chatId: number): Promise<void> {
    this.logger.log(`run Default ${chatId}`);

    await this.botService.sendMessage(chatId, messages.DEFAULT);

    this.logger.log(`Default successfully ended ${chatId}`);
  }

  @Cron('0 */5 * * * *')
  async fetchBitcoinPrice() {
    this.logger.log('Fetching BTC price...');
    const priceMessage = await this.getBitcoinPriceMessage();
    await this.botService.sendMessage(412620176, priceMessage);
  }

  async getBitcoinBinancePriceMessage(): Promise<string> {
    try {
      const { data } = await lastValueFrom(this.httpService.get(fileUrlBinance));
      const price = parseFloat(data.price).toFixed(2);
      this.logger.log(`Текущий курс BTC: $${price}`);
      return `Текущий курс BTC: $${price}`;
    } catch (error) {
      this.logger.error('Ошибка при получении цены BTC', error);
      return 'Не удалось получить курс BTC.';
    }
  }

  async getBitcoinPriceMessage(): Promise<string> {
    try {
      const apiId = 'bd443f00-092c-4436-92a4-a704ef679e24';
      // const apiUrl = 'https://payeer.com/api/trade/';
      const apiSecret = 'api_secret_key';
      const method = 'ticker';
      const ts = Math.floor(Date.now());
      const req = JSON.stringify({ ts });

      const sign = crypto
        // .createHmac('sha256', this.apiSecret)
        .createHmac('sha256', apiSecret)
        .update(method + req)
        .digest('hex');

      const { data } = await lastValueFrom(
        // this.httpService.post(`${this.apiUrl}${method}`, req, {
        this.httpService.post(`${fileUrlBinance}${method}`, req, {
          headers: {
            'Content-Type': 'application/json',
            // 'API-ID': this.apiId,
            'API-ID': apiId,
            'API-SIGN': sign,
          },
        }),
      );

      if (data.success && data.pairs && data.pairs.BTC_USDT) {
        const priceBuy = parseFloat(data.pairs.BTC_USDT.ask).toFixed(2);
        const priceSell = parseFloat(data.pairs.BTC_USDT.bid).toFixed(2);

        return `Покупка BTC: $${priceBuy}, Продажа BTC: $${priceSell}`;
      } else {
        throw new Error('Ошибка получения данных');
      }
    } catch (error) {
      this.logger.error('Ошибка при получении цены BTC', error);
      return 'Не удалось получить курс BTC.';
    }
  }
}
