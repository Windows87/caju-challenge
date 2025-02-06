import { Test, TestingModule } from '@nestjs/testing';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
import { MccsService } from 'src/mccs/mccs.service';
import { PrismaService } from 'src/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { MerchantsService } from './merchants.service';

describe('MerchantsService', () => {
  let service: MerchantsService;
  let prisma: PrismaService;
  let mccsService: MccsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantsService,
        MccsService,
        BalanceTypesService,
        PrismaService,
      ],
    }).compile();

    service = module.get<MerchantsService>(MerchantsService);
    prisma = module.get<PrismaService>(PrismaService);
    mccsService = module.get<MccsService>(MccsService);
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

    const createMerchantDto = new CreateMerchantDto();

    createMerchantDto.name = merchantData.name;
    createMerchantDto.mccId = merchantData.mccId;

    mccsService.findOne = jest.fn().mockReturnValueOnce(mccData);
    prisma.merchant.create = jest.fn().mockReturnValueOnce(merchantData);

    expect(await service.create(createMerchantDto)).toBe(merchantData);
  });

  it('should try to create a merchant and receive mcc not found', async () => {
    const merchantData = {
      merchantId: 1,
      name: 'UBER EATS                   SAO PAULO BR',
      mccId: 89,
    };

    const createMerchantDto = new CreateMerchantDto();

    createMerchantDto.name = merchantData.name;
    createMerchantDto.mccId = merchantData.mccId;

    mccsService.findOne = jest.fn().mockReturnValueOnce(null);
    prisma.merchant.create = jest.fn().mockReturnValueOnce(merchantData);

    await expect(service.create(createMerchantDto)).rejects.toThrow(
      'MCC not found',
    );
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

    expect(await service.findAll()).toBe(merchantsData);
  });
});
