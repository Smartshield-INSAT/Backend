import { Timestamp } from '../../common/base_class/timestamp.entity';

import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('naming')
export class Naming extends Timestamp {
    @PrimaryColumn('varchar', { length: 39 }) // Length 39 to accommodate IPv4 and IPv6
    ip!: string;

    @Column('varchar', { length: 255, nullable: false })
    name!: string;
}
