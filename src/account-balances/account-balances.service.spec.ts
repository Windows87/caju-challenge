import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AccountBalancesService } from './account-balances.service';

describe('AccountBalancesService', () => {
  let service: AccountBalancesService;
  let prisma: PrismaService;
  let accountsService: AccountsService;
  let balanceTypesService: BalanceTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountBalancesService,
        PrismaService,
        AccountsService,
        UsersService,
        CompaniesService,
        BalanceTypesService,
      ],
    }).compile();

    service = module.get<AccountBalancesService>(AccountBalancesService);
    prisma = module.get<PrismaService>(PrismaService);
    accountsService = module.get<AccountsService>(AccountsService);
    balanceTypesService = module.get<BalanceTypesService>(BalanceTypesService);
  });

  it('should create an account balance', async () => {
    const accountData = {
      accountId: 1,
      userId: 1,
      companyId: 1,
    };

    const balanceTypeData = {
      balanceTypeId: 1,
      name: 'Vale Alimentação',
      slug: 'MEAL',
    };

    const accountBalanceData = {
      balanceTypeId: 1,
      accountId: 1,
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(accountData);
    balanceTypesService.findOne = jest
      .fn()
      .mockReturnValueOnce(balanceTypeData);

    prisma.accountBalance.create = jest
      .fn()
      .mockReturnValueOnce(accountBalanceData);

    expect(await service.create(accountBalanceData)).toBe(accountBalanceData);
  });

  it('should charge account', async () => {
    const accountData = {
      accountId: 1,
      userId: 1,
      companyId: 1,
    };

    const balanceTypeData = {
      balanceTypeId: 1,
      name: 'Vale Alimentação',
      slug: 'MEAL',
    };

    const chargeAccountBalanceDto = {
      accountId: 1,
      balanceTypeId: 1,
      amount: 100,
    };

    const updatedAccountBalanceData = {
      balanceTypeId: 1,
      accountId: 1,
      balance: 100,
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(accountData);
    balanceTypesService.findOne = jest
      .fn()
      .mockReturnValueOnce(balanceTypeData);

    prisma.accountBalance.update = jest
      .fn()
      .mockReturnValueOnce(updatedAccountBalanceData);

    expect(await service.chargeAccountBalance(chargeAccountBalanceDto)).toBe(
      updatedAccountBalanceData,
    );
  });

  it('should charge account and handle amount less than 0', async () => {
    const accountData = {
      accountId: 1,
      userId: 1,
      companyId: 1,
    };

    const balanceTypeData = {
      balanceTypeId: 1,
      name: 'Vale Alimentação',
      slug: 'MEAL',
    };

    const chargeAccountBalanceDto = {
      accountId: 1,
      balanceTypeId: 1,
      amount: -100,
    };

    const updatedAccountBalanceData = {
      balanceTypeId: 1,
      accountId: 1,
      balance: 100,
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(accountData);
    balanceTypesService.findOne = jest
      .fn()
      .mockReturnValueOnce(balanceTypeData);

    prisma.accountBalance.update = jest
      .fn()
      .mockReturnValueOnce(updatedAccountBalanceData);

    await expect(
      service.chargeAccountBalance(chargeAccountBalanceDto),
    ).rejects.toThrow('Amount must be greater than 0');
  });

  it('should try to charge account and handle account not found', async () => {
    const balanceTypeData = {
      balanceTypeId: 1,
      name: 'Vale Alimentação',
      slug: 'MEAL',
    };

    const chargeAccountBalanceDto = {
      accountId: 1,
      balanceTypeId: 1,
      amount: 100,
    };

    const updatedAccountBalanceData = {
      balanceTypeId: 1,
      accountId: 1,
      balance: 100,
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(null);
    balanceTypesService.findOne = jest
      .fn()
      .mockReturnValueOnce(balanceTypeData);

    prisma.accountBalance.update = jest
      .fn()
      .mockReturnValueOnce(updatedAccountBalanceData);

    await expect(
      service.chargeAccountBalance(chargeAccountBalanceDto),
    ).rejects.toThrow('Account not found');
  });

  it('should find by account and balance type', async () => {
    const accountBalanceData = {
      balanceTypeId: 1,
      accountId: 1,
    };

    prisma.accountBalance.findUnique = jest
      .fn()
      .mockReturnValueOnce(accountBalanceData);

    expect(
      await service.findByAccountAndBalanceType(
        accountBalanceData.accountId,
        accountBalanceData.balanceTypeId,
      ),
    ).toBe(accountBalanceData);
  });
});
