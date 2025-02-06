import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    expect(await controller.findAll()).toBe(usersData);
  });

  it('should create an user', async () => {
    const userData = {
      userId: 1,
      fullname: 'Yuri',
      cpf: '00000000000',
    };

    const createUserDto = {
      fullname: userData.fullname,
      cpf: userData.cpf,
    };

    prisma.user.create = jest.fn().mockReturnValueOnce(userData);

    expect(await controller.create(createUserDto)).toBe(userData);
  });
});
