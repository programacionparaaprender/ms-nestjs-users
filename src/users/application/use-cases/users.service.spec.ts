/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */


import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../../domain/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUserRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('findAll debe retornar una lista de usuarios', async () => {
    const users: User[] = [{ id: 1, nombre: 'Luis', email: 'luis@mail.com', password: 'pass' }];
    mockUserRepository.find.mockResolvedValue(users);

    const result = await service.findAll();
    expect(result).toEqual(users);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  it('findOneById debe retornar un usuario si existe', async () => {
    const user = { id: 1, nombre: 'Luis', email: 'luis@mail.com', password: 'pass' };
    mockUserRepository.findOneBy.mockResolvedValue(user);

    const result = await service.findOneById(1);
    expect(result).toEqual(user);
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('findOneById debe lanzar NotFoundException si no existe el usuario', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOneById(999)).rejects.toThrow(NotFoundException);
  });

  it('create debe crear un nuevo usuario con password hasheado', async () => {
    const dto: CreateUserDto = { nombre: 'Luis', email: 'luis@mail.com', password: '123456' };
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = { id: 1, ...dto, password: hashedPassword };
    mockUserRepository.create.mockReturnValue(user);
    mockUserRepository.save.mockResolvedValue(user);

    const result = await service.create(dto);

    expect(result).toEqual(user);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...dto,
      password: expect.any(String),
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith(user);
  });

  it('update debe actualizar un usuario existente', async () => {
    const oldUser = { id: 1, nombre: 'Luis', email: 'luis@mail.com', password: 'old' };
    const dto: UpdateUserDto = { nombre: 'Luis Updated', email: 'luis@mail.com', password: 'newpass' };
    const updated = { ...oldUser, ...dto, password: await bcrypt.hash(dto.password, 10) };

    mockUserRepository.findOneBy.mockResolvedValue(oldUser);
    mockUserRepository.save.mockResolvedValue(updated);

    const result = await service.update('1', dto);

    expect(result.nombre).toBe(dto.nombre);
    expect(result.password).not.toBe('newpass'); // debería estar hasheado
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('remove debe eliminar un usuario existente', async () => {
    const user = { id: 1, nombre: 'Luis', email: 'luis@mail.com', password: 'pass' };
    mockUserRepository.findOneBy.mockResolvedValue(user);
    mockUserRepository.remove.mockResolvedValue(user);

    await service.remove('1');

    expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
  });
});
