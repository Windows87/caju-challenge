import { Injectable } from '@nestjs/common';
import { mcc as Mcc } from '@prisma/client';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { PrismaService } from 'src/prisma.service';
import { CreateMccDto } from './dto/create-mcc.dto';

@Injectable()
export class MccsService {
  constructor(
    private prisma: PrismaService,
    private balanceTypesService: BalanceTypesService,
  ) {}

  async create(createMccDto: CreateMccDto): Promise<Mcc> {
    const balanceType = await this.balanceTypesService.findOne(
      createMccDto.balanceTypeId,
    );

    if (!balanceType) throw new Error('Balance type not found');

    return await this.prisma.mcc.create({
      data: createMccDto,
    });
  }

  async findAll() {
    return this.prisma.mcc.findMany();
  }

  async findOne(mccId: number) {
    return this.prisma.mcc.findUnique({
      where: { mccId },
    });
  }

  async findByCode(code: string) {
    return this.prisma.mcc.findUnique({
      where: { code },
    });
  }
}
