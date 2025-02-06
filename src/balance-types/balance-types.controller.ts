import { Body, Controller, Get, Post } from '@nestjs/common';
import { BalanceTypesService } from './balance-types.service';
import { CreateBalanceTypeDto } from './dto/create-balance-type.dto';

@Controller('balance-types')
export class BalanceTypesController {
  constructor(private readonly balanceTypesService: BalanceTypesService) {}

  @Post()
  create(@Body() createBalanceTypeDto: CreateBalanceTypeDto) {
    return this.balanceTypesService.create(createBalanceTypeDto);
  }

  @Get()
  findAll() {
    return this.balanceTypesService.findAll();
  }
}
