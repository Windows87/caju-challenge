import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AccountBalancesController } from './account-balances.controller';
import { AccountBalancesService } from './account-balances.service';

describe('AccountBalancesController', () => {
  let controller: AccountBalancesController;
  let prisma: PrismaService;
  let accountsService: AccountsService;
  let balanceTypesService: BalanceTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountBalancesController],
      providers: [
        AccountBalancesService,
        PrismaService,
        AccountsService,
        UsersService,
        CompaniesService,
        BalanceTypesService,
      ],
    }).compile();

    controller = module.get<AccountBalancesController>(
      AccountBalancesController,
    );

    prisma = module.get<PrismaService>(PrismaService);
    accountsService = module.get<AccountsService>(AccountsService);
    balanceTypesService = module.get<BalanceTypesService>(BalanceTypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    expect(await controller.chargeAccountBalance(chargeAccountBalanceDto)).toBe(
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
      controller.chargeAccountBalance(chargeAccountBalanceDto),
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
      controller.chargeAccountBalance(chargeAccountBalanceDto),
    ).rejects.toThrow('Account not found');
  });
});
