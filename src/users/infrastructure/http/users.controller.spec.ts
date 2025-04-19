/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../../application/use-cases/users.service';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { User } from '../../domain/entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn((): Promise<User[]> => {
      return Promise.resolve([
        { id: 1, nombre: 'Juan', email: 'juan@example.com', password: 'hashed' },
      ]);
    }),
    create: jest.fn((dto: CreateUserDto): Promise<User> => {
      return Promise.resolve({
        id: 2,
        nombre: dto.nombre,
        email: dto.email,
        password: 'hashedPassword',
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('findAll() debe retornar lista de usuarios', async () => {
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe('Juan');
    expect(service.findAll).toHaveBeenCalled();
  });

  it('create() debe crear y retornar un usuario', async () => {
    const dto: CreateUserDto = {
      nombre: 'Luis',
      email: 'luis@example.com',
      password: '123456',
    };

    const result = await controller.create(dto);
    expect(result.nombre).toBe('Luis');
    expect(result.email).toBe('luis@example.com');
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
