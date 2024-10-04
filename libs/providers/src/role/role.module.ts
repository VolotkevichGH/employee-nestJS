import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../../../database/src/entities/role.entity';
import { JwtAuthGuard } from '../../../shared/src/guards/jwt.auth.guard';
import { RolesGuard } from '../../../shared/src/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [RoleService, JwtAuthGuard, RolesGuard],
  exports: [RoleService],
})
export class RoleModule {}
