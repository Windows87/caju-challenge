import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { CompaniesService } from 'src/companies/companies.service';
import { MccsService } from 'src/mccs/mccs.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';

describe('MerchantsController', () => {
  let controller: MerchantsController;
  let prisma: PrismaService;
  let mccsService: MccsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantsController],
      providers: [
        MerchantsService,
        MccsService,
        BalanceTypesService,
        PrismaService,
        AccountsService,
        UsersService,
        CompaniesService,
        AccountBalancesService,
      ],
    }).compile();

    controller = module.get<MerchantsController>(MerchantsController);
    prisma = module.get<PrismaService>(PrismaService);
    mccsService = module.get<MccsService>(MccsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all merchants', async () => {
    const merchantsData = [
      {
        merchantId: 1,
        name: 'UBER EATS                   SAO PAULO BR',
        mccId: 1,
      },
      {
        merchantId: 2,
        name: 'IFOOD                       SAO PAULO BR',
        mccId: 1,
      },
    ];

    prisma.merchant.findMany = jest.fn().mockReturnValueOnce(merchantsData);

    expect(await controller.findAll()).toBe(merchantsData);
  });

  it('should create a merchant', async () => {
    const mccData = {
      mccId: 1,
      code: '5411',
      balanceTypeId: 1,
    };

    const merchantData = {
      merchantId: 1,
      name: 'UBER EATS                   SAO PAULO BR',
      mccId: mccData.mccId,
    };

    const createMerchantDto = {
      name: merchantData.name,
      mccId: merchantData.mccId,
    };

    mccsService.findOne = jest.fn().mockReturnValueOnce(mccData);
    prisma.merchant.create = jest.fn().mockReturnValueOnce(merchantData);

    expect(await controller.create(createMerchantDto)).toBe(merchantData);
  });

  it('should try to create a merchant and receive mcc not found', async () => {
    const merchantData = {
      merchantId: 1,
      name: 'UBER EATS                   SAO PAULO BR',
      mccId: 8,
    };

    const createMerchantDto = {
      name: merchantData.name,
      mccId: merchantData.mccId,
    };

    mccsService.findOne = jest.fn().mockReturnValueOnce(null);
    prisma.merchant.create = jest.fn().mockReturnValueOnce(merchantData);

    await expect(controller.create(createMerchantDto)).rejects.toThrow(
      'MCC not found',
    );
  });
});
