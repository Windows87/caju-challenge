import { Injectable } from '@nestjs/common';
import { balanceType as BalanceType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateBalanceTypeDto } from './dto/create-balance-type.dto';

@Injectable()
export class BalanceTypesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createBalanceTypeDto: CreateBalanceTypeDto,
  ): Promise<BalanceType> {
    return await this.prisma.balanceType.create({
      data: createBalanceTypeDto,
    });
  }

  async findAll() {
    return await this.prisma.balanceType.findMany();
  }
}
