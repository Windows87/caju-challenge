import { Body, Controller, Post } from '@nestjs/common';
import { AccountBalancesService } from './account-balances.service';
import { CreateAccountBalanceDto } from './dto/create-account-balance.dto';

@Controller('account-balances')
export class AccountBalancesController {
  constructor(
    private readonly accountBalancesService: AccountBalancesService,
  ) {}

  @Post()
  create(@Body() createAccountBalanceDto: CreateAccountBalanceDto) {
    return this.accountBalancesService.create(createAccountBalanceDto);
  }
}
