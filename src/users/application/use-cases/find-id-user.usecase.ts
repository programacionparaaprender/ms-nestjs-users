/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserReportImplRepository } from '../../infrastructure/users/repositories/user-report-impl.repository';

@Injectable()
export class FindIdUserUseCase {
    constructor(private readonly usersService: UserReportImplRepository) {}
    execute(id:string | number): Promise<User> {
      return this.usersService.findOneById(Number(id));
    }
}
  