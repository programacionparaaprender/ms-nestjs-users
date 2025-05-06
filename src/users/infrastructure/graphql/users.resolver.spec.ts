/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from '../../application/use-cases/users.service';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { User } from '../../domain/entities/user.entity';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn((): Promise<User[]> => {
      return Promise.resolve([
        { id: 1, nombre: 'Juan', email: 'juan@example.com', password: 'hashed' },
      ]);
    }),
    findOneById: jest.fn((id: number): Promise<User> => {
      return Promise.resolve({
        id,
        nombre: 'Juan',
        email: 'juan@example.com',
        password: 'hashed',
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
        nombre: dto.nombre || 'Juan',
        email: dto.email || 'juan@example.com',
        password: 'hashedPassword',
      });
    }),
    remove: jest.fn((id: string): Promise<void> => {
      return Promise.resolve();
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('debe estar definido', () => {
    expect(resolver).toBeDefined();
  });

  it('findAll() debe retornar todos los usuarios', async () => {
    const result = await resolver.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe('Juan');
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne() debe retornar un usuario por ID', async () => {
    const result = await resolver.findOne(1);
    expect(result.id).toBe(1);
    expect(result.nombre).toBe('Juan');
    expect(service.findOneById).toHaveBeenCalledWith(1);
  });

  it('createUser() debe crear y retornar un usuario', async () => {
    const dto: CreateUserDto = {
      nombre: 'Luis',
      email: 'luis@example.com',
      password: '123456',
    };

    const result = await resolver.createUser(dto);
    expect(result.nombre).toBe('Luis');
    expect(result.email).toBe('luis@example.com');
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('updateUser() debe actualizar y retornar un usuario', async () => {
    const dto: UpdateUserDto = {
      nombre: 'Carlos',
      email: 'carlos@example.com',
      password:'123456'
    };

    const result = await resolver.updateUser('1', dto);
    expect(result.nombre).toBe('Carlos');
    expect(result.email).toBe('carlos@example.com');
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('removeUser() debe eliminar un usuario', async () => {
    const result = await resolver.removeUser('1');
    expect(result).toBe(true);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
