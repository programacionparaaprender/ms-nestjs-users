/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserDto } from '../../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../../application/dto/update-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { FindAllUsersUseCase } from '../../../application/use-cases/find-all-users.usecase';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.usecase';
import { FindIdUserUseCase } from '../../../application/use-cases/find-id-user.usecase';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.usecase';
import { RemoveUserUseCase } from '../../../application/use-cases/remove-user.usecase';

describe('UsersController', () => {
  let controller: UsersController;

  const user: User = {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'hashedpass',
  };

  const mockFindAllUsersUseCase = {
    execute: jest.fn().mockResolvedValue([user]),
  };

  const mockFindIdUserUseCase = {
    execute: jest.fn().mockResolvedValue(user),
  };

  const mockCreateUserUseCase = {
    execute: jest.fn().mockImplementation((dto: CreateUserDto) =>
      Promise.resolve({ ...user, ...dto, id: 2 })
    ),
  };

  const mockUpdateUserUseCase = {
    execute: jest.fn().mockImplementation((id: string, dto: UpdateUserDto) =>
      Promise.resolve({ ...user, ...dto, id: Number(id) })
    ),
  };

  const mockRemoveUserUseCase = {
    execute: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: FindAllUsersUseCase, useValue: mockFindAllUsersUseCase },
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: FindIdUserUseCase, useValue: mockFindIdUserUseCase },
        { provide: UpdateUserUseCase, useValue: mockUpdateUserUseCase },
        { provide: RemoveUserUseCase, useValue: mockRemoveUserUseCase },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should return an array of users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([user]);
    expect(mockFindAllUsersUseCase.execute).toHaveBeenCalled();
  });

  it('findOne should return a user by ID', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(user);
    expect(mockFindIdUserUseCase.execute).toHaveBeenCalledWith('1');
  });

  it('create should return the created user', async () => {
    const dto: CreateUserDto = {
      nombre: 'Luis',
      email: 'luis@example.com',
      password: '123456',
    };
    const result = await controller.create(dto);
    expect(result).toMatchObject({
      id: 2,
      nombre: dto.nombre,
      email: dto.email,
    });
    expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('update should return the updated user', async () => {
    const dto: UpdateUserDto = {
      nombre: 'Pedro',
      email: 'luis@example.com',
      password: 'newpassword',
    };
    const result = await controller.update('1', dto);
    expect(result.nombre).toBe('Pedro');
    expect(result.id).toBe(1);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith('1', dto);
  });

  it('remove should return void', async () => {
    const result = await controller.remove('1');
    expect(result).toBeUndefined();
    expect(mockRemoveUserUseCase.execute).toHaveBeenCalledWith('1');
  });
});
