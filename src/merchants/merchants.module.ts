import { Module } from '@nestjs/common';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { MccsService } from 'src/mccs/mccs.service';
import { PrismaService } from 'src/prisma.service';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';

@Module({
  controllers: [MerchantsController],
  providers: [
    MerchantsService,
    MccsService,
    BalanceTypesService,
    PrismaService,
  ],
})
export class MerchantsModule {}
