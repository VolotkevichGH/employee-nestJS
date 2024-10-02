import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../../shared/src/constants/constants';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import config from '../../../../app-main/configuration/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../../../database/src/entities/token.entity';
import { JwtAuthGuard } from '../../../shared/src/guards/jwt.auth.guard';
import { RolesGuard } from '../../../shared/src/guards/roles.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([Token]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
