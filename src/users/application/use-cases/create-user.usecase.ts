/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserWriterImplRepository } from '../../infrastructure/users/repositories/user-writer-impl.repository';


@Injectable()
export class CreateUserUseCase {
    constructor(private readonly usersService: UserWriterImplRepository) {}
    execute(params: CreateUserDto): Promise<User> {
      return this.usersService.create(params);
    }
}
  