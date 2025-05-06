/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '../../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../../application/dto/update-user.dto';
import { FindAllUsersUseCase } from '../../../application/use-cases/find-all-users.usecase';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.usecase';
import { FindIdUserUseCase } from '../../../application/use-cases/find-id-user.usecase';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.usecase';
import { RemoveUserUseCase } from '../../../application/use-cases/remove-user.usecase';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  const user: User = {
    id: 1,
    nombre: 'Juan',
    email: 'juan@example.com',
    password: 'hashedPassword',
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
      providers: [
        UsersResolver,
        { provide: FindAllUsersUseCase, useValue: mockFindAllUsersUseCase },
        { provide: FindIdUserUseCase, useValue: mockFindIdUserUseCase },
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: UpdateUserUseCase, useValue: mockUpdateUserUseCase },
        { provide: RemoveUserUseCase, useValue: mockRemoveUserUseCase },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('findAll() should return array of users', async () => {
    const result = await resolver.findAll();
    expect(result).toEqual([user]);
    expect(mockFindAllUsersUseCase.execute).toHaveBeenCalled();
  });

  it('findOne() should return one user by id', async () => {
    const result = await resolver.findOne(1);
    expect(result).toEqual(user);
    expect(mockFindIdUserUseCase.execute).toHaveBeenCalledWith(1);
  });

  it('createUser() should return created user', async () => {
    const dto: CreateUserDto = {
      nombre: 'Luis',
      email: 'luis@example.com',
      password: '123456',
    };
    const result = await resolver.createUser(dto);
    expect(result).toMatchObject({
      id: 2,
      nombre: dto.nombre,
      email: dto.email,
    });
    expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('updateUser() should return updated user', async () => {
    const dto: UpdateUserDto = {
      nombre: 'Carlos',
      email: 'carlos@example.com',
      password: 'updatedpass',
    };
    const result = await resolver.updateUser('1', dto);
    expect(result.nombre).toBe('Carlos');
    expect(result.id).toBe(1);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith('1', dto);
  });

  it('removeUser() should return true after deletion', async () => {
    const result = await resolver.removeUser('1');
    expect(result).toBe(true);
    expect(mockRemoveUserUseCase.execute).toHaveBeenCalledWith('1');
  });
});
