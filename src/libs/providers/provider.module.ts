import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccountingModule } from './accounting/accounting.module';
import { HrDepartmentModule } from './hr-departament/hr-department.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, AccountingModule, HrDepartmentModule, UserModule],
})
export class ProviderModule {}
