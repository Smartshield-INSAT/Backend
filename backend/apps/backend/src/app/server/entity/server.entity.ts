import { Timestamp } from '../../common/base_class/timestamp.entity';
import { User } from '../../user/entity/user.entity';

import { ArrayNotEmpty, IsArray, IsMACAddress, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity('server')
export class Server extends Timestamp {
    @Index()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, undefined, { nullable: true, eager: true })
    @JoinColumn({ name: 'uuid', foreignKeyConstraintName: 'FK_USER' })
    @IsUUID()
    user!: Relation<User>;

    @Column('varchar', { length: 255, nullable: false })
    @IsString()
    @IsNotEmpty()
    hostname!: string;

    @Column('varchar', { length: 100, nullable: false })
    @IsString()
    @IsNotEmpty()
    os!: string;

    @Column('varchar', { length: 100, nullable: false })
    @IsString()
    @IsNotEmpty()
    arch!: string;

    @Column('simple-array', { nullable: false })
    @IsArray()
    @ArrayNotEmpty()
    @IsMACAddress({ each: true })
    macAddresses!: string[];
}
