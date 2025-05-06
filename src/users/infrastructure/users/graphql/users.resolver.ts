/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FindAllUsersUseCase } from 'src/users/application/use-cases/find-all-users.usecase';
import { CreateUserUseCase } from 'src/users/application/use-cases/create-user.usecase';
import { FindIdUserUseCase } from 'src/users/application/use-cases/find-id-user.usecase';
import { UpdateUserUseCase } from 'src/users/application/use-cases/update-user.usecase';
import { RemoveUserUseCase } from 'src/users/application/use-cases/remove-user.usecase';
import { CreateUserDto } from 'src/users/application/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/application/dto/update-user.dto';
import { User } from '../../../domain/entities/user.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly createUserUseCase:CreateUserUseCase,
    private readonly findIdUserUseCase: FindIdUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase
  ) {}

  @Query(() => [User])
  findAll() {
    return this.findAllUsersUseCase.execute();
  }

  @Query(() => User)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.findIdUserUseCase.execute(id);
  }

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserDto) {
    return this.createUserUseCase.execute(input);
  }

  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, input);
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    await this.removeUserUseCase.execute(id);
    return true;
  }
}
