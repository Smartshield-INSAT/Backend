import { Timestamp } from '../../app/common/base_class/timestamp.entity';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User extends Timestamp {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}
