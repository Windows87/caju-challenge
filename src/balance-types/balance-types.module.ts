import { Module } from '@nestjs/common';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { CompaniesService } from 'src/companies/companies.service';
import { MccsService } from 'src/mccs/mccs.service';
import { MerchantsService } from 'src/merchants/merchants.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { BalanceTypesController } from './balance-types.controller';
import { BalanceTypesService } from './balance-types.service';

@Module({
  controllers: [BalanceTypesController],
  providers: [
    BalanceTypesService,
    PrismaService,
    AccountsService,
    UsersService,
    CompaniesService,
    AccountBalancesService,
    MccsService,
    MerchantsService,
  ],
})
export class BalanceTypesModule {}
