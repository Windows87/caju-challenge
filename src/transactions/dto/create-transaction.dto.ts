import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @ApiProperty()
  account: string;

  @IsNotEmpty()
  @ApiProperty()
  totalAmount: number;

  @IsNotEmpty()
  @ApiProperty()
  mcc: string;

  @IsNotEmpty()
  @ApiProperty()
  merchant: string;
}
