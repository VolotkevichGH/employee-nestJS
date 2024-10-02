import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from '@nestjs/config';
import { HrModule } from './hr/hr.module';
import config from '../../../app-main/configuration/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    HrModule,
  ],
})
export class ProviderModule {}
