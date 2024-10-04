import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/src/entities/user.entity';
import { JwtAuthGuard } from '../../../shared/src/guards/jwt.auth.guard';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from '../../../shared/src/guards/roles.guard';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RoleModule],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, JwtStrategy, RolesGuard],
  exports: [UserService],
})
export class UserModule {}
