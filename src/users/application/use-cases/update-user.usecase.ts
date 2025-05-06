/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserWriterImplRepository } from 'src/users/infrastructure/users/repositories/user-writer-impl.repository';


@Injectable()
export class UpdateUserUseCase {
    constructor(private readonly usersService: UserWriterImplRepository) {}
    execute(id: string, data: UpdateUserDto): Promise<User> {
      return this.usersService.update(id, data);
    }
}
  