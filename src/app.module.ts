import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { BalanceTypesModule } from './balance-types/balance-types.module';
import { MccsModule } from './mccs/mccs.module';
import { MerchantsModule } from './merchants/merchants.module';
import { AccountsModule } from './accounts/accounts.module';
import { AccountBalancesModule } from './account-balances/account-balances.module';

@Module({
  imports: [UsersModule, CompaniesModule, BalanceTypesModule, MccsModule, MerchantsModule, AccountsModule, AccountBalancesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
