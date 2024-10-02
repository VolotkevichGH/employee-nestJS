
import { ConfigModule } from '@nestjs/config';
import config from '../configuration/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { Module } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserEntity } from '../../libs/database/src/entities/user.entity';
import { ProviderModule } from '../../libs/providers/src/provider.module';
import { RoleEntity } from '../../libs/database/src/entities/role.entity';
import { CreateRolesAndUsers1727742085230 } from '../../libs/database/src/migrations/1727742085230-createRolesAndUsers';
import { InsertRoles1727742119389 } from '../../libs/database/src/migrations/1727742119389-insertRoles';
import { Token } from '../../libs/database/src/entities/token.entity';

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
      entities: [UserEntity, RoleEntity, Token],
      logger: 'simple-console',
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: 5432,
      database: process.env.DATABASE_NAME,
      logger: 'simple-console',
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
      migrations: [CreateRolesAndUsers1727742085230, InsertRoles1727742119389],
      migrationsTableName: "custom_migration_table",
      migrationsRun: true,
    })
  ],
})
export class AppModule {}
