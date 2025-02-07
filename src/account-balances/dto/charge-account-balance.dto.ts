import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChargeAccountBalanceDto {
  @IsNotEmpty()
  @ApiProperty()
  accountId: number;

  @IsNotEmpty()
  @ApiProperty()
  balanceTypeId: number;

  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}
