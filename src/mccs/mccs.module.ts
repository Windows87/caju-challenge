import { Module } from '@nestjs/common';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { PrismaService } from 'src/prisma.service';
import { MccsController } from './mccs.controller';
import { MccsService } from './mccs.service';

@Module({
  controllers: [MccsController],
  providers: [MccsService, BalanceTypesService, PrismaService],
})
export class MccsModule {}
