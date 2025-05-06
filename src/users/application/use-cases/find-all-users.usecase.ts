/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/users/domain/entities/user.entity';

@Injectable()
export class FindAllUsersUseCase {
    constructor(private readonly usersService: UsersService) {}
    execute(): Promise<User[]> {
      return this.usersService.findAll();
    }
}
  