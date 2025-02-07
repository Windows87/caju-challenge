import { IsNotEmpty } from 'class-validator';

export class DecreaseAccountBalanceDto {
  @IsNotEmpty()
  accountId: number;

  @IsNotEmpty()
  balanceTypeId: number;

  @IsNotEmpty()
  amount: number;
}
