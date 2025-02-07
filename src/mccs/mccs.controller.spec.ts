import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { MccsController } from './mccs.controller';
import { MccsService } from './mccs.service';

describe('MccsController', () => {
  let controller: MccsController;
  let balanceTypesService: BalanceTypesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MccsController],
      providers: [
        MccsService,
        BalanceTypesService,
        PrismaService,
        AccountsService,
        UsersService,
        CompaniesService,
        AccountBalancesService,
      ],
    }).compile();

    controller = module.get<MccsController>(MccsController);
    prisma = module.get<PrismaService>(PrismaService);
    balanceTypesService = module.get<BalanceTypesService>(BalanceTypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all mccs', async () => {
    const mccsData = [
      {
        mccId: 1,
        code: '5411',
        balanceTypeId: 1,
      },
      {
        mccId: 2,
        code: '5412',
        balanceTypeId: 1,
      },
    ];

    prisma.mcc.findMany = jest.fn().mockReturnValueOnce(mccsData);

    expect(await controller.findAll()).toBe(mccsData);
  });

  it('should create a mcc', async () => {
    const balanceType = {
      balanceTypeId: 1,
      name: 'Vale Alimentação',
      slug: 'MEAL',
    };

    const mccData = {
      mccId: 1,
      code: '5411',
      balanceTypeId: balanceType.balanceTypeId,
    };

    const createMccDto = {
      code: mccData.code,
      balanceTypeId: mccData.balanceTypeId,
    };

    balanceTypesService.findOne = jest.fn().mockReturnValueOnce(balanceType);
    prisma.mcc.create = jest.fn().mockReturnValueOnce(mccData);

    expect(await controller.create(createMccDto)).toBe(mccData);
  });

  it('should try to create a mcc and receive balance type not found', async () => {
    const mccData = {
      mccId: 1,
      code: '5411',
      balanceTypeId: 8,
    };

    const createMccDto = {
      code: mccData.code,
      balanceTypeId: mccData.balanceTypeId,
    };

    balanceTypesService.findOne = jest.fn().mockReturnValueOnce(null);
    prisma.mcc.create = jest.fn().mockReturnValueOnce(mccData);

    await expect(controller.create(createMccDto)).rejects.toThrow(
      'Balance type not found',
    );
  });
});
