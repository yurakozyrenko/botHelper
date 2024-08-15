import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const HTTP_PORT = configService.get('HTTP_PORT');

  await app.listen(HTTP_PORT, () => {
    console.log(`🚀 Server listening ${HTTP_PORT} `);
  });
}
bootstrap();
