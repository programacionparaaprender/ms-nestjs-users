/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { UsersService } from './application/use-cases/users.service';
import { UsersResolver } from './infrastructure/graphql/users.resolver';
import { UsersController } from './infrastructure/http/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { FindAllUsersUseCase } from './application/use-cases/find-all-users.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersResolver, CreateUserUseCase, FindAllUsersUseCase],
  controllers: [UsersController],
})
export class UsersModule {}

