import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AccountBalancesController } from './account-balances.controller';
import { AccountBalancesService } from './account-balances.service';

@Module({
  controllers: [AccountBalancesController],
  providers: [AccountBalancesService, PrismaService],
})
export class AccountBalancesModule {}
