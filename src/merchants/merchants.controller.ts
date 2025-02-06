import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { MerchantsService } from './merchants.service';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  async create(@Body() createMerchantDto: CreateMerchantDto) {
    try {
      return await this.merchantsService.create(createMerchantDto);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Get()
  findAll() {
    return this.merchantsService.findAll();
  }
}
