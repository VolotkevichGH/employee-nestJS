import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { JwtAuthGuard } from '../../../shared/src/guards/jwt.auth.guard';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from '../../../shared/src/guards/roles.guard';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [UserModule, RoleModule],
  controllers: [HrController],
  providers: [HrService, JwtAuthGuard,JwtStrategy, RolesGuard],
  exports: [HrService]
})
export class HrModule {}
