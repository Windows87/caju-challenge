import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create an user', async () => {
    const userData = {
      userId: 1,
      fullname: 'Yuri',
      cpf: '00000000000',
    };

    const createUserDto = new CreateUserDto();

    createUserDto.fullname = userData.fullname;
    createUserDto.cpf = userData.cpf;

    prisma.user.create = jest.fn().mockReturnValueOnce(userData);

    expect(await service.create(createUserDto)).toBe(userData);
  });

  it('should return all users', async () => {
    const usersData = [
      {
        userId: 1,
        fullname: 'Yuri',
        cpf: '00000000000',
      },
      {
        userId: 2,
        fullname: 'Danilo',
        cpf: '00000000000',
      },
    ];

    prisma.user.findMany = jest.fn().mockReturnValueOnce(usersData);

    expect(await service.findAll()).toBe(usersData);
  });
});
