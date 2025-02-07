import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { balanceType as BalanceType } from '@prisma/client';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { PrismaService } from 'src/prisma.service';
import { CreateBalanceTypeDto } from './dto/create-balance-type.dto';

@Injectable()
export class BalanceTypesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
    @Inject(forwardRef(() => AccountBalancesService))
    private accountBalancesService: AccountBalancesService,
  ) {}

  async create(
    createBalanceTypeDto: CreateBalanceTypeDto,
  ): Promise<BalanceType> {
    const balanceType = await this.prisma.balanceType.create({
      data: createBalanceTypeDto,
    });

    const accounts = await this.accountsService.findAll();

    for (const account of accounts) {
      await this.accountBalancesService.create({
        accountId: account.accountId,
        balanceTypeId: balanceType.balanceTypeId,
      });
    }

    return balanceType;
  }

  async findAll() {
    return await this.prisma.balanceType.findMany();
  }

  async findOne(balanceTypeId: number): Promise<BalanceType | null> {
    return await this.prisma.balanceType.findUnique({
      where: { balanceTypeId },
    });
  }

  async findBySlug(slug: string): Promise<BalanceType | null> {
    return await this.prisma.balanceType.findUnique({
      where: { slug },
    });
  }
}
