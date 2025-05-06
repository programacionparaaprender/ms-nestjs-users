/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { UsersService } from 'src/users/infrastructure/users/repositories/users.service';
import { UsersResolver } from '../../infrastructure/users/graphql/users.resolver';
import { UsersController } from '../../infrastructure/users/http/users.controller';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { FindAllUsersUseCase } from '../../application/use-cases/find-all-users.usecase';
import { FindIdUserUseCase } from 'src/users/application/use-cases/find-id-user.usecase';
import { UpdateUserUseCase } from 'src/users/application/use-cases/update-user.usecase';
import { RemoveUserUseCase } from 'src/users/application/use-cases/remove-user.usecase';
import { UserRemovableImplRepository } from 'src/users/infrastructure/users/repositories/user-removable-impl.repository';
import { UserReportImplRepository } from 'src/users/infrastructure/users/repositories/user-report-impl.repository';
import { UserWriterImplRepository } from 'src/users/infrastructure/users/repositories/user-writer-impl.repository';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService, 
    UsersResolver, 
    UserRemovableImplRepository,
    UserReportImplRepository,
    UserWriterImplRepository,
    CreateUserUseCase, 
    FindAllUsersUseCase, 
    FindIdUserUseCase, 
    UpdateUserUseCase, 
    RemoveUserUseCase],
  controllers: [UsersController],
})
export class UsersModule {}

