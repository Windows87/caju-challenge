import { Module } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import { MccsService } from 'src/mccs/mccs.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';

@Module({
  controllers: [MerchantsController],
  providers: [
    MerchantsService,
    MccsService,
    BalanceTypesService,
    PrismaService,
    AccountsService,
    UsersService,
    CompaniesService,
  ],
})
export class MerchantsModule {}
