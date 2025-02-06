import { Module } from '@nestjs/common';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  controllers: [AccountsController],
  providers: [
    AccountsService,
    UsersService,
    CompaniesService,
    PrismaService,
    BalanceTypesService,
  ],
})
export class AccountsModule {}
