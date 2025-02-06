import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAccountBalanceDto } from './dto/create-account-balance.dto';

@Injectable()
export class AccountBalancesService {
  constructor(private prisma: PrismaService) {}

  create(createAccountBalanceDto: CreateAccountBalanceDto) {
    return 'This action adds a new accountBalance';
  }

  async findAll() {
    return await this.prisma.accountBalance.findMany();
  }
}
