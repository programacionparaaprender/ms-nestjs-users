/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/application/dto/create-user.dto';
import { User } from 'src/users/domain/entities/user.entity';
import { UpdateUserDto } from 'src/users/application/dto/update-user.dto';


@Injectable()
export class UserWriterImplRepository {

  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}
  
    async create(data: CreateUserDto): Promise<User> {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = this.userRepository.create({
        ...data,
        password: hashedPassword,
      });
      return this.userRepository.save(user);
    }
  
    async update(id: string, data: UpdateUserDto): Promise<User> {
      const user = await this.userRepository.findOneBy({ id: Number(id) });
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
  
      const updatedUser = Object.assign(user, data);
      return this.userRepository.save(updatedUser);
    }

}
