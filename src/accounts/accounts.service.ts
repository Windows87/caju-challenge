import { Injectable } from '@nestjs/common';
import { CompaniesService } from 'src/companies/companies.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private companiesService: CompaniesService,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const user = await this.usersService.findOne(createAccountDto.userId);

    if (!user) throw new Error('User not found');

    const company = await this.companiesService.findOne(
      createAccountDto.companyId,
    );

    if (!company) throw new Error('Company not found');

    return await this.prisma.account.create({
      data: createAccountDto,
    });
  }

  async findAll() {
    return await this.prisma.account.findMany({
      include: {
        company: true,
        user: true,
        accountBalance: {
          include: {
            balanceType: true,
          },
        },
      },
    });
  }
}
