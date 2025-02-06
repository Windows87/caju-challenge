import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    try {
      return await this.accountsService.create(createAccountDto);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }
}
