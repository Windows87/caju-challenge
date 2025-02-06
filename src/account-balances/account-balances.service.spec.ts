import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalancesService } from './account-balances.service';

describe('AccountBalancesService', () => {
  let service: AccountBalancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountBalancesService],
    }).compile();

    service = module.get<AccountBalancesService>(AccountBalancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
