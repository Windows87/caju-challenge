import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { CreateMccDto } from './dto/create-mcc.dto';
import { MccsService } from './mccs.service';

@Controller('mccs')
export class MccsController {
  constructor(private readonly mccsService: MccsService) {}

  @Post()
  async create(@Body() createMccDto: CreateMccDto) {
    try {
      return await this.mccsService.create(createMccDto);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Get()
  findAll() {
    return this.mccsService.findAll();
  }
}
