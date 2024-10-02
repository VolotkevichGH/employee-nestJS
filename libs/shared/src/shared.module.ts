import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../../../app-main/configuration/config';

@Module({
  imports: [  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    load: [config],
  }),]
})
export class SharedModule {}