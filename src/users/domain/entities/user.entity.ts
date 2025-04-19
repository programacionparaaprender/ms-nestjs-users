/* eslint-disable prettier/prettier */
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
@ObjectType()
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Field()
  id: number;

  @Column()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Field()
  nombre: string;

  @Column({ unique: true })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Field()
  email: string;

  @Column()
  password: string;
}
