import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { PrismaService } from 'src/prisma.service';
import { ChargeAccountBalanceDto } from './dto/charge-account-balance.dto';
import { CreateAccountBalanceDto } from './dto/create-account-balance.dto';

@Injectable()
export class AccountBalancesService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AccountsService))
    private accountsService: AccountsService,
  ) {}

  async create(createAccountBalanceDto: CreateAccountBalanceDto) {
    const account = await this.accountsService.findOne(
      createAccountBalanceDto.accountId,
    );

    if (!account) {
      throw new Error('Account not found');
    }

    return await this.prisma.accountBalance.create({
      data: {
        balance: 0,
        account: {
          connect: { accountId: account.accountId },
        },
        balanceType: {
          connect: { balanceTypeId: createAccountBalanceDto.balanceTypeId },
        },
      },
    });
  }

  async chargeAccountBalance(chargeAccountBalanceDto: ChargeAccountBalanceDto) {
    const account = await this.accountsService.findOne(
      chargeAccountBalanceDto.accountId,
    );

    if (!account) {
      throw new Error('Account not found');
    }

    if (chargeAccountBalanceDto.amount < 0) {
      throw new Error('Amount must be greater than 0');
    }

    return await this.prisma.accountBalance.update({
      where: {
        accountId_balanceTypeId: {
          accountId: account.accountId,
          balanceTypeId: chargeAccountBalanceDto.balanceTypeId,
        },
      },
      data: {
        balance: {
          increment: chargeAccountBalanceDto.amount,
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.accountBalance.findMany();
  }
}
