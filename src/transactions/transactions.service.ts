import { Injectable } from '@nestjs/common';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import transactionsCodes from 'src/constants/transactions-codes';
import { MccsService } from 'src/mccs/mccs.service';
import { MerchantsService } from 'src/merchants/merchants.service';
import { PrismaService } from 'src/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private accountsService: AccountsService,
    private mccsService: MccsService,
    private merchantsService: MerchantsService,
    private accountBalancesService: AccountBalancesService,
    private balancesTypesService: BalanceTypesService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    if (this.isTotalAmountLessThanZero(createTransactionDto.totalAmount)) {
      return { code: transactionsCodes.PROBLEM };
    }

    const { account, mcc, accountBalance } =
      await this.getAccountMccAndBalance(createTransactionDto);
    if (!account || !mcc || !accountBalance)
      return { code: transactionsCodes.PROBLEM };

    if (
      this.isAccountBalanceLessThanTotalAmount(
        accountBalance.balance,
        createTransactionDto.totalAmount,
      )
    ) {
      const result = await this.handleInsufficientFunds(
        account.accountId,
        mcc.balanceTypeId,
        accountBalance.balance,
        createTransactionDto.totalAmount,
      );
      if (result) return result;
    } else {
      await this.accountBalancesService.decreaseBalance({
        accountId: account.accountId,
        balanceTypeId: mcc.balanceTypeId,
        amount: createTransactionDto.totalAmount,
      });
    }

    await this.prisma.transaction.create({
      data: {
        amount: createTransactionDto.totalAmount,
        merchantName: createTransactionDto.merchant,
        account: {
          connect: { accountId: account.accountId },
        },
        mcc: {
          connect: { mccId: mcc.mccId },
        },
      },
    });

    return { code: transactionsCodes.APPROVED };
  }

  private isTotalAmountLessThanZero(totalAmount: number): boolean {
    return totalAmount < 0;
  }

  async getAccountMccAndBalance(createTransactionDto: CreateTransactionDto) {
    const account = await this.accountsService.findOne(
      +createTransactionDto.account,
    );

    if (!account) return { account: null, mcc: null, accountBalance: null };

    let mcc = await this.mccsService.findByCode(createTransactionDto.mcc);
    if (!mcc) return { account: null, mcc: null, accountBalance: null };

    const merchant = await this.merchantsService.findByName(
      createTransactionDto.merchant,
    );
    if (merchant) mcc = merchant.mcc;

    const accountBalance =
      await this.accountBalancesService.findByAccountAndBalanceType(
        account.accountId,
        mcc.balanceTypeId,
      );

    if (!accountBalance)
      return { account: null, mcc: null, accountBalance: null };

    return { account, mcc, accountBalance };
  }

  private isAccountBalanceLessThanTotalAmount(
    accountBalance: number,
    totalAmount: number,
  ): boolean {
    return accountBalance < totalAmount;
  }

  private async handleInsufficientFunds(
    accountId: number,
    balanceTypeId: number,
    accountBalance: number,
    totalAmount: number,
  ) {
    const cashBalanceType = await this.balancesTypesService.findBySlug('CASH');
    if (!cashBalanceType) return { code: transactionsCodes.PROBLEM };

    const cashBalance =
      await this.accountBalancesService.findByAccountAndBalanceType(
        accountId,
        cashBalanceType.balanceTypeId,
      );
    if (!cashBalance) return { code: transactionsCodes.PROBLEM };

    if (cashBalance.balance + accountBalance < totalAmount) {
      return { code: transactionsCodes.INSUFFICIENT_FUNDS };
    }

    await this.accountBalancesService.decreaseBalance({
      accountId: accountId,
      balanceTypeId: balanceTypeId,
      amount: accountBalance,
    });

    await this.accountBalancesService.decreaseBalance({
      accountId: accountId,
      balanceTypeId: cashBalanceType.balanceTypeId,
      amount: totalAmount - accountBalance,
    });

    return null;
  }

  async findAll() {
    return await this.prisma.transaction.findMany();
  }
}
