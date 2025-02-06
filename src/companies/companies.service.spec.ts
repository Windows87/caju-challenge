import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService, PrismaService],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a company', async () => {
    const companyData = {
      companyId: 1,
      name: 'Caju',
      cnpj: '00000000000001',
    };

    const createCompanyDto = new CreateCompanyDto();

    createCompanyDto.name = companyData.name;
    createCompanyDto.cnpj = companyData.cnpj;

    prisma.company.create = jest.fn().mockReturnValueOnce(companyData);

    expect(await service.create(createCompanyDto)).toBe(companyData);
  });

  it('should return all companies', async () => {
    const companiesData = [
      {
        companyId: 1,
        name: 'Caju',
        cnpj: '00000000000001',
      },
      {
        companyId: 2,
        name: 'Cajuzão',
        cnpj: '00000000000002',
      },
    ];

    prisma.company.findMany = jest.fn().mockReturnValueOnce(companiesData);

    expect(await service.findAll()).toBe(companiesData);
  });
});
