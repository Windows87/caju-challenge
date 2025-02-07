import { Module } from '@nestjs/common';
import { AccountBalancesModule } from './account-balances/account-balances.module';
import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalanceTypesModule } from './balance-types/balance-types.module';
import { CompaniesModule } from './companies/companies.module';
import { MccsModule } from './mccs/mccs.module';
import { MerchantsModule } from './merchants/merchants.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    UsersModule,
    CompaniesModule,
    BalanceTypesModule,
    MccsModule,
    MerchantsModule,
    AccountsModule,
    AccountBalancesModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
