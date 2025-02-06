import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { BalanceTypesController } from './balance-types.controller';
import { BalanceTypesService } from './balance-types.service';

describe('BalanceTypesController', () => {
  let controller: BalanceTypesController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceTypesController],
      providers: [BalanceTypesService, PrismaService],
    }).compile();

    controller = module.get<BalanceTypesController>(BalanceTypesController);
    prisma = module.get<PrismaService>(PrismaService);
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

  it('should create a company', async () => {
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

    expect(await controller.create(createBalanceTypeDto)).toBe(balanceTypeData);
  });
});
