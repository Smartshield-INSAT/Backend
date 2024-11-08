import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column()
  name: string;

  @Column()
  email: string;
}
