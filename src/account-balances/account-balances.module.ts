import { Module } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import { MccsService } from 'src/mccs/mccs.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AccountBalancesController } from './account-balances.controller';
import { AccountBalancesService } from './account-balances.service';

@Module({
  controllers: [AccountBalancesController],
  providers: [
    AccountBalancesService,
    PrismaService,
    AccountsService,
    UsersService,
    CompaniesService,
    BalanceTypesService,
    CompaniesService,
    MccsService,
  ],
})
export class AccountBalancesModule {}
