import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { BalanceTypesController } from './balance-types.controller';
import { BalanceTypesService } from './balance-types.service';

describe('BalanceTypesController', () => {
  let controller: BalanceTypesController;
  let prisma: PrismaService;
  let accountsService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceTypesController],
      providers: [
        BalanceTypesService,
        PrismaService,
        AccountsService,
        UsersService,
        CompaniesService,
        AccountBalancesService,
      ],
    }).compile();

    controller = module.get<BalanceTypesController>(BalanceTypesController);
    prisma = module.get<PrismaService>(PrismaService);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all balance types', async () => {
    const balanceTypesData = [
      {
        balanceTypeId: 1,
        name: 'Vale Alimentação',
        slug: 'MEAL',
      },
      {
        balanceTypeId: 2,
        name: 'Vale Refeição',
        slug: 'FOOD',
      },
    ];

    prisma.balanceType.findMany = jest
      .fn()
      .mockReturnValueOnce(balanceTypesData);

    expect(await controller.findAll()).toBe(balanceTypesData);
  });

  it('should create a balance type', async () => {
    const balanceTypeData = {
      balanceTypeId: 1,
      name: 'Vale Alimentação',
      slug: 'MEAL',
    };

    const createBalanceTypeDto = {
      name: balanceTypeData.name,
      slug: balanceTypeData.slug,
    };

    prisma.balanceType.create = jest.fn().mockReturnValueOnce(balanceTypeData);
    accountsService.findAll = jest.fn().mockReturnValueOnce([]);

    expect(await controller.create(createBalanceTypeDto)).toBe(balanceTypeData);
  });
});
