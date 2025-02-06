import { Injectable } from '@nestjs/common';
import { company as Company } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return await this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  async findAll() {
    return await this.prisma.company.findMany();
  }

  async findOne(companyId: number) {
    return await this.prisma.company.findUnique({
      where: { companyId },
    });
  }
}
