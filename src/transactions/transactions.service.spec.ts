import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import transactionsCodes from 'src/constants/transactions-codes';
import { MccsService } from 'src/mccs/mccs.service';
import { MerchantsService } from 'src/merchants/merchants.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;
  let mccsService: MccsService;
  let merchantsService: MerchantsService;
  let accountBalancesService: AccountBalancesService;
  let accountsService: AccountsService;
  let balanceTypesService: BalanceTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        PrismaService,
        AccountsService,
        MccsService,
        MerchantsService,
        AccountsService,
        BalanceTypesService,
        AccountBalancesService,
        UsersService,
        CompaniesService,
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
    accountsService = module.get<AccountsService>(AccountsService);
    mccsService = module.get<MccsService>(MccsService);
    merchantsService = module.get<MerchantsService>(MerchantsService);
    balanceTypesService = module.get<BalanceTypesService>(BalanceTypesService);
    accountBalancesService = module.get<AccountBalancesService>(
      AccountBalancesService,
    );
  });

  it('should approve transaction with mmc and without merchant', async () => {
    const accountData = {
      accountId: 1,
      userId: 2,
      companyId: 2,
      company: {
        companyId: 2,
        name: 'Caju',
        cnpj: '00000000000001',
      },
      user: {
        userId: 2,
        fullname: 'Yuri',
        cpf: '00000000000',
      },
      accountBalance: [
        {
          accountBalanceId: 1,
          accountId: 1,
          balanceTypeId: 1,
          balance: 300,
          balanceType: {
            balanceTypeId: 1,
            name: 'Vale Refeição',
            slug: 'FOOD',
          },
        },
        {
          accountBalanceId: 2,
          accountId: 1,
          balanceTypeId: 2,
          balance: 300,
          balanceType: {
            balanceTypeId: 2,
            name: 'Vale Alimentação',
            slug: 'MEAL',
          },
        },
        {
          accountBalanceId: 3,
          accountId: 1,
          balanceTypeId: 3,
          balance: 0,
          balanceType: {
            balanceTypeId: 3,
            name: 'Saldo Livre',
            slug: 'CASH',
          },
        },
      ],
    };

    const mccData = {
      mccId: 1,
      code: '5811',
      balanceTypeId: 1,
    };

    const transactionData = {
      account: accountData.accountId.toString(),
      totalAmount: 100,
      mcc: '5811',
      merchant: 'PADARIA DO ZE               SAO PAULO BR',
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(accountData);
    mccsService.findByCode = jest.fn().mockReturnValueOnce(mccData);
    merchantsService.findByName = jest.fn().mockReturnValueOnce(null);
    accountBalancesService.findByAccountAndBalanceType = jest
      .fn()
      .mockReturnValueOnce(accountData.accountBalance[1]);

    accountBalancesService.decreaseBalance = jest.fn();
    prisma.transaction.create = jest.fn();

    const transaction = await service.create(transactionData);

    expect(transaction).toEqual({ code: transactionsCodes.APPROVED });
  });

  it('should fail transaction due to insufficient funds with mcc and without merchant', async () => {
    const accountData = {
      accountId: 1,
      userId: 2,
      companyId: 2,
      company: {
        companyId: 2,
        name: 'Caju',
        cnpj: '00000000000001',
      },
      user: {
        userId: 2,
        fullname: 'Yuri',
        cpf: '00000000000',
      },
      accountBalance: [
        {
          accountBalanceId: 1,
          accountId: 1,
          balanceTypeId: 1,
          balance: 300,
          balanceType: {
            balanceTypeId: 1,
            name: 'Vale Refeição',
            slug: 'FOOD',
          },
        },
        {
          accountBalanceId: 2,
          accountId: 1,
          balanceTypeId: 2,
          balance: 300,
          balanceType: {
            balanceTypeId: 2,
            name: 'Vale Alimentação',
            slug: 'MEAL',
          },
        },
        {
          accountBalanceId: 3,
          accountId: 1,
          balanceTypeId: 3,
          balance: 0,
          balanceType: {
            balanceTypeId: 3,
            name: 'Saldo Livre',
            slug: 'CASH',
          },
        },
      ],
    };

    const mccData = {
      mccId: 1,
      code: '5811',
      balanceTypeId: 1,
    };

    const transactionData = {
      account: accountData.accountId.toString(),
      totalAmount: 350,
      mcc: '5811',
      merchant: 'PADARIA DO ZE               SAO PAULO BR',
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(accountData);
    mccsService.findByCode = jest.fn().mockReturnValueOnce(mccData);
    merchantsService.findByName = jest.fn().mockReturnValueOnce(null);
    accountBalancesService.findByAccountAndBalanceType = jest
      .fn()
      .mockReturnValueOnce(accountData.accountBalance[1])
      .mockReturnValueOnce(accountData.accountBalance[2]);

    balanceTypesService.findBySlug = jest.fn().mockReturnValueOnce({
      balanceTypeId: 3,
      name: 'Saldo Livre',
      slug: 'CASH',
    });

    accountBalancesService.decreaseBalance = jest.fn();
    prisma.transaction.create = jest.fn();

    const transaction = await service.create(transactionData);

    expect(transaction).toEqual({ code: transactionsCodes.INSUFFICIENT_FUNDS });
  });

  it('should fail transaction because total amount is less than zero', async () => {
    const accountData = {
      accountId: 1,
      userId: 2,
      companyId: 2,
      company: {
        companyId: 2,
        name: 'Caju',
        cnpj: '00000000000001',
      },
      user: {
        userId: 2,
        fullname: 'Yuri',
        cpf: '00000000000',
      },
      accountBalance: [
        {
          accountBalanceId: 1,
          accountId: 1,
          balanceTypeId: 1,
          balance: 300,
          balanceType: {
            balanceTypeId: 1,
            name: 'Vale Refeição',
            slug: 'FOOD',
          },
        },
        {
          accountBalanceId: 2,
          accountId: 1,
          balanceTypeId: 2,
          balance: 300,
          balanceType: {
            balanceTypeId: 2,
            name: 'Vale Alimentação',
            slug: 'MEAL',
          },
        },
        {
          accountBalanceId: 3,
          accountId: 1,
          balanceTypeId: 3,
          balance: 0,
          balanceType: {
            balanceTypeId: 3,
            name: 'Saldo Livre',
            slug: 'CASH',
          },
        },
      ],
    };

    const mccData = {
      mccId: 1,
      code: '5811',
      balanceTypeId: 1,
    };

    const transactionData = {
      account: '123',
      totalAmount: -100,
      mcc: '5811',
      merchant: 'PADARIA DO ZE               SAO PAULO BR',
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(accountData);
    mccsService.findByCode = jest.fn().mockReturnValueOnce(mccData);
    merchantsService.findByName = jest.fn().mockReturnValueOnce(null);
    accountBalancesService.findByAccountAndBalanceType = jest
      .fn()
      .mockReturnValueOnce(accountData.accountBalance[1]);

    accountBalancesService.decreaseBalance = jest.fn();
    prisma.transaction.create = jest.fn();

    const transaction = await service.create(transactionData);

    expect(transaction).toEqual({ code: transactionsCodes.PROBLEM });
  });

  it('should fail transaction because account is not found', async () => {
    const mccData = {
      mccId: 1,
      code: '5811',
      balanceTypeId: 1,
    };

    const transactionData = {
      account: '123',
      totalAmount: 100,
      mcc: '5811',
      merchant: 'PADARIA DO ZE               SAO PAULO BR',
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(null);
    mccsService.findByCode = jest.fn().mockReturnValueOnce(mccData);
    merchantsService.findByName = jest.fn().mockReturnValueOnce(null);
    accountBalancesService.findByAccountAndBalanceType = jest
      .fn()
      .mockReturnValueOnce(null);

    accountBalancesService.decreaseBalance = jest.fn();
    prisma.transaction.create = jest.fn();

    const transaction = await service.create(transactionData);

    expect(transaction).toEqual({ code: transactionsCodes.PROBLEM });
  });

  it('should fail transaction because mcc is not found', async () => {
    const accountData = {
      accountId: 1,
      userId: 2,
      companyId: 2,
      company: {
        companyId: 2,
        name: 'Caju',
        cnpj: '00000000000001',
      },
      user: {
        userId: 2,
        fullname: 'Yuri',
        cpf: '00000000000',
      },
      accountBalance: [
        {
          accountBalanceId: 1,
          accountId: 1,
          balanceTypeId: 1,
          balance: 300,
          balanceType: {
            balanceTypeId: 1,
            name: 'Vale Refeição',
            slug: 'FOOD',
          },
        },
        {
          accountBalanceId: 2,
          accountId: 1,
          balanceTypeId: 2,
          balance: 300,
          balanceType: {
            balanceTypeId: 2,
            name: 'Vale Alimentação',
            slug: 'MEAL',
          },
        },
        {
          accountBalanceId: 3,
          accountId: 1,
          balanceTypeId: 3,
          balance: 0,
          balanceType: {
            balanceTypeId: 3,
            name: 'Saldo Livre',
            slug: 'CASH',
          },
        },
      ],
    };

    const transactionData = {
      account: '123',
      totalAmount: 100,
      mcc: '5811',
      merchant: 'PADARIA DO ZE               SAO PAULO BR',
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(accountData);
    mccsService.findByCode = jest.fn().mockReturnValueOnce(null);
    merchantsService.findByName = jest.fn().mockReturnValueOnce(null);
    accountBalancesService.findByAccountAndBalanceType = jest
      .fn()
      .mockReturnValueOnce(null);

    accountBalancesService.decreaseBalance = jest.fn();
    prisma.transaction.create = jest.fn();

    const transaction = await service.create(transactionData);

    expect(transaction).toEqual({ code: transactionsCodes.PROBLEM });
  });

  it('should fail transaction because account balance is not found', async () => {
    const accountData = {
      accountId: 1,
      userId: 2,
      companyId: 2,
      company: {
        companyId: 2,
        name: 'Caju',
        cnpj: '00000000000001',
      },
      user: {
        userId: 2,
        fullname: 'Yuri',
        cpf: '00000000000',
      },
      accountBalance: [
        {
          accountBalanceId: 1,
          accountId: 1,
          balanceTypeId: 1,
          balance: 300,
          balanceType: {
            balanceTypeId: 1,
            name: 'Vale Refeição',
            slug: 'FOOD',
          },
        },
        {
          accountBalanceId: 3,
          accountId: 1,
          balanceTypeId: 3,
          balance: 0,
          balanceType: {
            balanceTypeId: 3,
            name: 'Saldo Livre',
            slug: 'CASH',
          },
        },
      ],
    };

    const mccData = {
      mccId: 1,
      code: '5811',
      balanceTypeId: 1,
    };

    const transactionData = {
      account: '123',
      totalAmount: 100,
      mcc: '5811',
      merchant: 'PADARIA DO ZE               SAO PAULO BR',
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(accountData);
    mccsService.findByCode = jest.fn().mockReturnValueOnce(mccData);
    merchantsService.findByName = jest.fn().mockReturnValueOnce(null);
    accountBalancesService.findByAccountAndBalanceType = jest
      .fn()
      .mockReturnValueOnce(null);

    accountBalancesService.decreaseBalance = jest.fn();
    prisma.transaction.create = jest.fn();

    const transaction = await service.create(transactionData);

    expect(transaction).toEqual({ code: transactionsCodes.PROBLEM });
  });

  it('should approve transaction using CASH with mmc and without merchant', async () => {
    const accountData = {
      accountId: 1,
      userId: 2,
      companyId: 2,
      company: {
        companyId: 2,
        name: 'Caju',
        cnpj: '00000000000001',
      },
      user: {
        userId: 2,
        fullname: 'Yuri',
        cpf: '00000000000',
      },
      accountBalance: [
        {
          accountBalanceId: 1,
          accountId: 1,
          balanceTypeId: 1,
          balance: 300,
          balanceType: {
            balanceTypeId: 1,
            name: 'Vale Refeição',
            slug: 'FOOD',
          },
        },
        {
          accountBalanceId: 2,
          accountId: 1,
          balanceTypeId: 2,
          balance: 300,
          balanceType: {
            balanceTypeId: 2,
            name: 'Vale Alimentação',
            slug: 'MEAL',
          },
        },
        {
          accountBalanceId: 3,
          accountId: 1,
          balanceTypeId: 3,
          balance: 100,
          balanceType: {
            balanceTypeId: 3,
            name: 'Saldo Livre',
            slug: 'CASH',
          },
        },
      ],
    };

    const mccData = {
      mccId: 1,
      code: '5811',
      balanceTypeId: 1,
    };

    const transactionData = {
      account: accountData.accountId.toString(),
      totalAmount: 400,
      mcc: '5811',
      merchant: 'PADARIA DO ZE               SAO PAULO BR',
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(accountData);
    mccsService.findByCode = jest.fn().mockReturnValueOnce(mccData);
    merchantsService.findByName = jest.fn().mockReturnValueOnce(null);
    accountBalancesService.findByAccountAndBalanceType = jest
      .fn()
      .mockReturnValueOnce(accountData.accountBalance[1])
      .mockReturnValueOnce(accountData.accountBalance[2]);
    balanceTypesService.findBySlug = jest.fn().mockReturnValueOnce({
      balanceTypeId: 3,
      name: 'Saldo Livre',
      slug: 'CASH',
    });

    accountBalancesService.decreaseBalance = jest.fn();
    prisma.transaction.create = jest.fn();

    const transaction = await service.create(transactionData);

    expect(transaction).toEqual({ code: transactionsCodes.APPROVED });
  });

  it('should fail transaction due to insufficient funds even using CASH with mmc and without merchant', async () => {
    const accountData = {
      accountId: 1,
      userId: 2,
      companyId: 2,
      company: {
        companyId: 2,
        name: 'Caju',
        cnpj: '00000000000001',
      },
      user: {
        userId: 2,
        fullname: 'Yuri',
        cpf: '00000000000',
      },
      accountBalance: [
        {
          accountBalanceId: 1,
          accountId: 1,
          balanceTypeId: 1,
          balance: 300,
          balanceType: {
            balanceTypeId: 1,
            name: 'Vale Refeição',
            slug: 'FOOD',
          },
        },
        {
          accountBalanceId: 2,
          accountId: 1,
          balanceTypeId: 2,
          balance: 300,
          balanceType: {
            balanceTypeId: 2,
            name: 'Vale Alimentação',
            slug: 'MEAL',
          },
        },
        {
          accountBalanceId: 3,
          accountId: 1,
          balanceTypeId: 3,
          balance: 100,
          balanceType: {
            balanceTypeId: 3,
            name: 'Saldo Livre',
            slug: 'CASH',
          },
        },
      ],
    };

    const mccData = {
      mccId: 1,
      code: '5811',
      balanceTypeId: 1,
    };

    const transactionData = {
      account: accountData.accountId.toString(),
      totalAmount: 450,
      mcc: '5811',
      merchant: 'PADARIA DO ZE               SAO PAULO BR',
    };

    accountsService.findOne = jest.fn().mockReturnValueOnce(accountData);
    mccsService.findByCode = jest.fn().mockReturnValueOnce(mccData);
    merchantsService.findByName = jest.fn().mockReturnValueOnce(null);
    accountBalancesService.findByAccountAndBalanceType = jest
      .fn()
      .mockReturnValueOnce(accountData.accountBalance[1])
      .mockReturnValueOnce(accountData.accountBalance[2]);
    balanceTypesService.findBySlug = jest.fn().mockReturnValueOnce({
      balanceTypeId: 3,
      name: 'Saldo Livre',
      slug: 'CASH',
    });

    accountBalancesService.decreaseBalance = jest.fn();
    prisma.transaction.create = jest.fn();

    const transaction = await service.create(transactionData);

    expect(transaction).toEqual({ code: transactionsCodes.INSUFFICIENT_FUNDS });
  });
});
