/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class UserRemovableImplRepository {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}
    
  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: Number(id) });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    await this.userRepository.remove(user);
  }
}
