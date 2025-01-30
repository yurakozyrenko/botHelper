import * as dotenv from 'dotenv';

dotenv.config();

const { HTTP_PORT, WEBHOOK_HOST, BOT_TOKEN } = process.env;

export default (): any =>
  ({
    API_PREFIX: '/api',
    API_VERSION: '/v1',
    HTTP_PORT: Number(HTTP_PORT) || 8000,
    WEBHOOK_HOST: WEBHOOK_HOST,
    BOT_TOKEN: BOT_TOKEN,
  }) as const;
