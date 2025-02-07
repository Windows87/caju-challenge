import { Injectable } from '@nestjs/common';
import { MccsService } from 'src/mccs/mccs.service';
import { PrismaService } from 'src/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(
    private prisma: PrismaService,
    private mccsService: MccsService,
  ) {}

  async create(createMerchantDto: CreateMerchantDto) {
    const mcc = await this.mccsService.findOne(createMerchantDto.mccId);

    if (!mcc) throw new Error('MCC not found');

    return await this.prisma.merchant.create({
      data: createMerchantDto,
    });
  }

  async findAll() {
    return await this.prisma.merchant.findMany();
  }

  async findByName(name: string) {
    return await this.prisma.merchant.findFirst({
      where: { name },
      include: { mcc: true },
    });
  }
}
