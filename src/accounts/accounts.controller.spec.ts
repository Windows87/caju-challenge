import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

describe('AccountsController', () => {
  let controller: AccountsController;
  let prisma: PrismaService;
  let companiesService: CompaniesService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        PrismaService,
        CompaniesService,
        UsersService,
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    prisma = module.get<PrismaService>(PrismaService);
    companiesService = module.get<CompaniesService>(CompaniesService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an account', async () => {
    const userData = {
      userId: 1,
      fullname: 'Yuri',
      cpf: '00000000000',
    };

    const companyData = {
      companyId: 1,
      name: 'Caju',
      cnpj: '00000000000001',
    };

    const accountData = {
      accountId: 1,
      userId: userData.userId,
      companyId: companyData.companyId,
    };

    const createAccountDto = new CreateAccountDto();

    createAccountDto.userId = userData.userId;
    createAccountDto.companyId = companyData.companyId;

    usersService.findOne = jest.fn().mockReturnValueOnce(userData);
    companiesService.findOne = jest.fn().mockReturnValueOnce(companyData);

    prisma.account.create = jest.fn().mockReturnValueOnce(accountData);

    expect(await controller.create(createAccountDto)).toBe(accountData);
  });

  it('should try to create an account and receive user not found', async () => {
    const companyData = {
      companyId: 1,
      name: 'Caju',
      cnpj: '00000000000001',
    };

    const accountData = {
      accountId: 1,
      userId: 2,
      companyId: companyData.companyId,
    };

    const createAccountDto = new CreateAccountDto();

    createAccountDto.userId = 2;
    createAccountDto.companyId = companyData.companyId;

    usersService.findOne = jest.fn().mockReturnValueOnce(null);
    companiesService.findOne = jest.fn().mockReturnValueOnce(companyData);

    prisma.account.create = jest.fn().mockReturnValueOnce(accountData);

    await expect(controller.create(createAccountDto)).rejects.toThrow(
      'User not found',
    );
  });

  it('should try to create an account and receive company not found', async () => {
    const userData = {
      userId: 1,
      fullname: 'Yuri',
      cpf: '00000000000',
    };

    const accountData = {
      accountId: 1,
      userId: userData.userId,
      companyId: 15,
    };

    const createAccountDto = new CreateAccountDto();

    createAccountDto.userId = userData.userId;
    createAccountDto.companyId = 15;

    usersService.findOne = jest.fn().mockReturnValueOnce(userData);
    companiesService.findOne = jest.fn().mockReturnValueOnce(null);

    prisma.account.create = jest.fn().mockReturnValueOnce(accountData);

    await expect(controller.create(createAccountDto)).rejects.toThrow(
      'Company not found',
    );
  });

  it('should return all accounts', async () => {
    const accountsData = [
      {
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
            balance: 300,
            balanceType: {
              balanceTypeId: 3,
              name: 'Saldo Livre',
              slug: 'CASH',
            },
          },
        ],
      },
    ];

    prisma.account.findMany = jest.fn().mockReturnValueOnce(accountsData);

    expect(await controller.findAll()).toBe(accountsData);
  });
});
