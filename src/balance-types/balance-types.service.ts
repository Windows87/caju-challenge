import { Injectable } from '@nestjs/common';
import { balanceType as BalanceType } from '@prisma/client';
import { AccountsService } from 'src/accounts/accounts.service';
import { PrismaService } from 'src/prisma.service';
import { CreateBalanceTypeDto } from './dto/create-balance-type.dto';

@Injectable()
export class BalanceTypesService {
  constructor(
    private prisma: PrismaService,
    private accountsService: AccountsService,
  ) {}

  async create(
    createBalanceTypeDto: CreateBalanceTypeDto,
  ): Promise<BalanceType> {
    return await this.prisma.$transaction(async (prisma) => {
      const balanceType = await prisma.balanceType.create({
        data: createBalanceTypeDto,
      });

      const accounts = await this.accountsService.findAll();

      await Promise.all(
        accounts.map(async (account) => {
          await prisma.accountBalance.create({
            data: {
              balance: 0,
              account: {
                connect: { accountId: account.accountId },
              },
              balanceType: {
                connect: { balanceTypeId: balanceType.balanceTypeId },
              },
            },
          });
        }),
      );

      return balanceType;
    });
  }

  async findAll() {
    return await this.prisma.balanceType.findMany();
  }

  async findOne(balanceTypeId: number): Promise<BalanceType | null> {
    return await this.prisma.balanceType.findUnique({
      where: { balanceTypeId },
    });
  }
}
