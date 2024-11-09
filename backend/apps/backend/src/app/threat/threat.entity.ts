import { Timestamp } from '../common/base_class/timestamp.entity';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Threat extends Timestamp {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false })
    title!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: false, default: 'WEAK' })
    severity!: string;

    @Column({ default: 'OPEN' })
    status!: string;
}
