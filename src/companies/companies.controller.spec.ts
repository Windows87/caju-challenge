import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [CompaniesService, PrismaService],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    expect(await controller.findAll()).toBe(companiesData);
  });

  it('should create a company', async () => {
    const companyData = {
      companyId: 1,
      name: 'Caju',
      cnpj: '00000000000001',
    };

    const createCompanyDto = {
      name: companyData.name,
      cnpj: companyData.cnpj,
    };

    prisma.company.create = jest.fn().mockReturnValueOnce(companyData);

    expect(await controller.create(createCompanyDto)).toBe(companyData);
  });
});
