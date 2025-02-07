import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AccountBalancesService } from './account-balances.service';
import { ChargeAccountBalanceDto } from './dto/charge-account-balance.dto';

@Controller('account-balances')
export class AccountBalancesController {
  constructor(
    private readonly accountBalancesService: AccountBalancesService,
  ) {}

  @Post()
  async chargeAccountBalance(
    @Body() chargeAccountBalanceDto: ChargeAccountBalanceDto,
  ) {
    try {
      return await this.accountBalancesService.chargeAccountBalance(
        chargeAccountBalanceDto,
      );
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
