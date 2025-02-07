import { Module } from '@nestjs/common';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import { MccsService } from 'src/mccs/mccs.service';
import { MerchantsService } from 'src/merchants/merchants.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    PrismaService,
    AccountsService,
    MccsService,
    MerchantsService,
    AccountsService,
    BalanceTypesService,
    AccountBalancesService,
    UsersService,
    CompaniesService,
  ],
})
export class TransactionsModule {}
