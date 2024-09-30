import { HrDepartmentModule } from '../libs/providers/hr-departament/hr-department.module';
import { AccountingModule } from '../libs/providers/accounting/accounting.module';
import { UserModule } from '../libs/providers/user/user.module';
import { ConfigModule } from '@nestjs/config';
import config from './configuration/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { Module } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserEntity } from '../libs/database/entities/user.entity';
import { ProviderModule } from '../libs/providers/provider.module';

@Module({
  imports: [
    ProviderModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: 5432,
      database: process.env.DATABASE_NAME,
      entities: [UserEntity],
      logger: 'simple-console',
      logging: 'all',
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
})
export class AppModule {}
