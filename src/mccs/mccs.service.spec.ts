import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateMccDto } from './dto/create-mcc.dto';
import { MccsService } from './mccs.service';

describe('MccsService', () => {
  let service: MccsService;
  let prisma: PrismaService;
  let balanceTypesService: BalanceTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<MccsService>(MccsService);
    prisma = module.get<PrismaService>(PrismaService);
    balanceTypesService = module.get<BalanceTypesService>(BalanceTypesService);
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

    const createMccDto = new CreateMccDto();

    createMccDto.code = mccData.code;
    createMccDto.balanceTypeId = mccData.balanceTypeId;

    balanceTypesService.findOne = jest.fn().mockReturnValueOnce(balanceType);
    prisma.mcc.create = jest.fn().mockReturnValueOnce(mccData);

    expect(await service.create(createMccDto)).toBe(mccData);
  });

  it('should try to create a mcc and receive balance type not found', async () => {
    const mccData = {
      mccId: 1,
      code: '5411',
      balanceTypeId: 8,
    };

    const createMccDto = new CreateMccDto();

    createMccDto.code = mccData.code;
    createMccDto.balanceTypeId = mccData.balanceTypeId;

    balanceTypesService.findOne = jest.fn().mockReturnValueOnce(null);
    prisma.company.create = jest.fn().mockReturnValueOnce(mccData);

    await expect(service.create(createMccDto)).rejects.toThrow(
      'Balance type not found',
    );
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

    expect(await service.findAll()).toBe(mccsData);
  });

  it('should return mcc by id', async () => {
    const mccsData = {
      mccId: 1,
      code: '5411',
      balanceTypeId: 1,
    };

    prisma.mcc.findUnique = jest.fn().mockReturnValueOnce(mccsData);

    expect(await service.findOne(mccsData.mccId)).toBe(mccsData);
  });

  it('should return mcc by code', async () => {
    const mccsData = {
      mccId: 1,
      code: '5411',
      balanceTypeId: 1,
    };

    prisma.mcc.findUnique = jest.fn().mockReturnValueOnce(mccsData);

    expect(await service.findByCode('5411')).toBe(mccsData);
  });
});
