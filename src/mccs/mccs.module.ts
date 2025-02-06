import { Module } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { MccsController } from './mccs.controller';
import { MccsService } from './mccs.service';

@Module({
  controllers: [MccsController],
  providers: [
    MccsService,
    BalanceTypesService,
    PrismaService,
    AccountsService,
    UsersService,
    CompaniesService,
  ],
})
export class MccsModule {}
