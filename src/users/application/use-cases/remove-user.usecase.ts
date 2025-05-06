/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserRemovableImplRepository } from 'src/users/infrastructure/users/repositories/user-removable-impl.repository';

@Injectable()
export class RemoveUserUseCase {
    constructor(private readonly usersService: UserRemovableImplRepository) {}
    execute(id:string): Promise<void> {
      return this.usersService.remove(id);
    }
}
  