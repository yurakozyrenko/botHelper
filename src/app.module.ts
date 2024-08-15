import { Module } from '@nestjs/common';
import config from './configuration/config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ load: [config] })],
})
export class AppModule {}
