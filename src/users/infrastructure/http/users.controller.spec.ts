/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../../application/use-cases/users.service';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
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
    findOneById: jest.fn((id: string): Promise<User> => {
      return Promise.resolve({
        id: Number(id),
        nombre: 'Carlos',
        email: 'carlos@example.com',
        password: 'hashedPassword',
      });
    }),
    create: jest.fn((dto: CreateUserDto): Promise<User> => {
      return Promise.resolve({
        id: 2,
        nombre: dto.nombre,
        email: dto.email,
        password: 'hashedPassword',
      });
    }),
    update: jest.fn((id: string, dto: UpdateUserDto): Promise<User> => {
      return Promise.resolve({
        id: Number(id),
        nombre: dto.nombre,
        email: dto.email,
        password: 'updatedPassword',
      });
    }),
    remove: jest.fn((id: string): Promise<void> => {
      return Promise.resolve();
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

  it('findOne() debe retornar un usuario por ID', async () => {
    const result = await controller.findOne('5');
    expect(result.id).toBe(5);
    expect(result.nombre).toBe('Carlos');
    expect(service.findOneById).toHaveBeenCalledWith('5');
  });

  it('update() debe actualizar y retornar el usuario actualizado', async () => {
    const dto: UpdateUserDto = {
      nombre: 'Pedro',
      email: 'pedro@example.com',
      password: '123456'
    };

    const result = await controller.update('3', dto);
    expect(result.id).toBe(3);
    expect(result.nombre).toBe('Pedro');
    expect(service.update).toHaveBeenCalledWith('3', dto);
  });

  it('remove() debe eliminar un usuario', async () => {
    await controller.remove('7');
    expect(service.remove).toHaveBeenCalledWith('7');
  });
});
