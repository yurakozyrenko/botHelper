export enum Actions {
  START = '/start',
  PRICE = '/price',
}

export const messages = {
  START: `Это бот для выполнения действий пользователей из чатов. Выбери из Меню`,
  DEFAULT: `Это бот для выполнения действий пользователей из чатов. Выбери из Меню`,
};

export const fileUrl = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
