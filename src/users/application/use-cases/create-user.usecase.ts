/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/users/domain/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';


@Injectable()
export class CreateUserUseCase {
    constructor(private readonly usersService: UsersService) {}
    execute(params: CreateUserDto): Promise<User> {
      return this.usersService.create(params);
    }
}
  