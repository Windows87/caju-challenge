import { Test, TestingModule } from '@nestjs/testing';
import { AccountBalancesController } from './account-balances.controller';
import { AccountBalancesService } from './account-balances.service';

describe('AccountBalancesController', () => {
  let controller: AccountBalancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountBalancesController],
      providers: [AccountBalancesService],
    }).compile();

    controller = module.get<AccountBalancesController>(AccountBalancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
