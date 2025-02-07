import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { BalanceTypesService } from './balance-types.service';

describe('BalanceTypesService', () => {
  let service: BalanceTypesService;
  let prisma: PrismaService;
  let accountsService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceTypesService,
        PrismaService,
        AccountsService,
        UsersService,
        CompaniesService,
        AccountBalancesService,
      ],
    }).compile();

    service = module.get<BalanceTypesService>(BalanceTypesService);
    prisma = module.get<PrismaService>(PrismaService);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it('should create a balance type', async () => {
    const balanceTypeData = {
      balanceTypeId: 1,
      name: 'Vale Alimentação',
      slug: 'MEAL',
    };

    prisma.balanceType.create = jest.fn().mockReturnValueOnce(balanceTypeData);
    accountsService.findAll = jest.fn().mockReturnValueOnce([]);

    expect(await service.create(balanceTypeData)).toBe(balanceTypeData);
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

    expect(await service.findAll()).toBe(balanceTypesData);
  });
});
