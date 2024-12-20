import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const {
  HTTP_PORT,
  LOGIN_ONE_WIN,
  PASSWORD_ONE_WIN,
  LOGIN_MELBET,
  PASSWORD_MELBET,
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_SYNCHRONIZE,
  SECRET_JWT,
  WEBHOOK_HOST,
  BOT_TOKEN,
} = process.env;

export default (): any =>
  ({
    API_PREFIX: '/api',
    API_VERSION: '/v1',
    HTTP_PORT: Number(HTTP_PORT) || 8000,
    LOGIN_ONE_WIN: LOGIN_ONE_WIN,
    PASSWORD_ONE_WIN: PASSWORD_ONE_WIN,
    LOGIN_MELBET: LOGIN_MELBET,
    PASSWORD_MELBET: PASSWORD_MELBET,
    POSTGRES_DB_SETTINGS: {
      type: DB_TYPE,
      host: DB_HOST,
      port: Number(DB_PORT) || 5432,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      autoLoadEntities: true,
      synchronize: DB_SYNCHRONIZE,
      namingStrategy: new SnakeNamingStrategy(),
    },
    SECRET_JWT: SECRET_JWT,
    WEBHOOK_HOST: WEBHOOK_HOST,
    BOT_TOKEN: BOT_TOKEN,
  }) as const;
