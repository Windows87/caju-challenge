import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BalanceTypesController } from './balance-types.controller';
import { BalanceTypesService } from './balance-types.service';

@Module({
  controllers: [BalanceTypesController],
  providers: [BalanceTypesService, PrismaService],
})
export class BalanceTypesModule {}
