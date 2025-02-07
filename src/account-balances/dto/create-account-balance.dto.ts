import { IsNotEmpty } from 'class-validator';

export class CreateAccountBalanceDto {
  @IsNotEmpty()
  accountId: number;

  @IsNotEmpty()
  balanceTypeId: number;
}
