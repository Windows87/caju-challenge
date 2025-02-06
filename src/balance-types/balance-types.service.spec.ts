import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { BalanceTypesService } from './balance-types.service';

describe('BalanceTypesService', () => {
  let service: BalanceTypesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceTypesService, PrismaService],
    }).compile();

    service = module.get<BalanceTypesService>(BalanceTypesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a balance type', async () => {
    const balanceTypeData = {
      balanceTypeId: 1,
      name: 'Vale Alimentação',
      slug: 'MEAL',
    };

    prisma.balanceType.create = jest.fn().mockReturnValueOnce(balanceTypeData);

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
