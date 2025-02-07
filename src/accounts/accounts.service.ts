import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AccountBalancesService } from 'src/account-balances/account-balances.service';
import { BalanceTypesService } from 'src/balance-types/balance-types.service';
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
    @Inject(forwardRef(() => BalanceTypesService))
    private balanceTypesService: BalanceTypesService,
    @Inject(forwardRef(() => AccountBalancesService))
    private accountBalancesService: AccountBalancesService,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const user = await this.usersService.findOne(createAccountDto.userId);

    if (!user) throw new Error('User not found');

    const company = await this.companiesService.findOne(
      createAccountDto.companyId,
    );

    if (!company) throw new Error('Company not found');

    const account = await this.prisma.account.create({
      data: createAccountDto,
    });

    const balanceTypes = await this.balanceTypesService.findAll();

    for (const balanceType of balanceTypes) {
      await this.accountBalancesService.create({
        accountId: account.accountId,
        balanceTypeId: balanceType.balanceTypeId,
      });
    }

    return account;
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

  async findOne(accountId: number) {
    return await this.prisma.account.findUnique({
      where: { accountId },
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
