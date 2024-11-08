// src/entities/server.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uuid' })  // Sets 'uuid' as the foreign key column name
  user: User;

  @Column()
  system: string;

  @Column({ unique: true })
  macAddress: string;
}
