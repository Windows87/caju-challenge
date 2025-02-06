import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  fullname: string;

  @IsNotEmpty()
  @ApiProperty()
  cpf: string;
}
