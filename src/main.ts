import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const API_PREFIX = configService.get('API_PREFIX');
  const API_VERSION = configService.get('API_VERSION');
  const HTTP_PORT = configService.get('HTTP_PORT');

  app.setGlobalPrefix(`${API_PREFIX}${API_VERSION}`);

  await app.listen(HTTP_PORT);
}
bootstrap();
