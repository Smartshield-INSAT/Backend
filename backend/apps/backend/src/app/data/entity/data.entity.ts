import { Timestamp } from '../../common/base_class/timestamp.entity';
import { Server } from '../../server/entity/server.entity';

import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity('data')
export class Data extends Timestamp {
    @Index()
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ nullable: false })
    ip!: string;

    @Column('float', { nullable: false })
    dur!: number;

    @Column('varchar', { length: 10, nullable: false })
    proto!: string;

    @Column('varchar', { length: 50, nullable: false })
    service!: string;

    @Column('varchar', { length: 50, nullable: false })
    state!: string;

    @Column('float', { nullable: false })
    spkts!: number;

    @Column('float', { nullable: false })
    dpkts!: number;

    @Column('float', { nullable: false })
    sbytes!: number;

    @Column('float', { nullable: false })
    dbytes!: number;

    @Column('float', { nullable: false })
    sload!: number;

    @Column('float', { nullable: false })
    dloss!: number;

    @Column('float', { nullable: false })
    dinpkt!: number;

    @Column('float', { nullable: false })
    tcprtt!: number;

    @Column('float', { nullable: false })
    smean!: number;

    @Column('float', { nullable: false })
    transDepth!: number;

    @Column('float', { nullable: false })
    ctSrcDportLtm!: number;

    @Column('float', { nullable: false })
    isFtpLogin!: number;

    @Column('float', { nullable: false })
    ctFlwHttpMthd!: number;

    @Column('float', { name: 'Speed_of_Operations_to_Speed_of_Data_Bytes', nullable: false })
    speedOfOperationsToSpeedOfDataBytes!: number;

    @Column('float', { name: 'Time_for_a_Single_Process', nullable: false })
    timeForASingleProcess!: number;

    @Column('float', { name: 'Ratio_of_Data_Flow', nullable: false })
    ratioOfDataFlow!: number;

    @Column('float', { name: 'Ratio_of_Packet_Flow', nullable: false })
    ratioOfPacketFlow!: number;

    @Column('float', { name: 'Total_Page_Errors', nullable: false })
    totalPageErrors!: number;

    @Column('float', { name: 'Network_Usage', nullable: false })
    networkUsage!: number;

    @Column('float', { name: 'Network_Activity_Rate', nullable: false })
    networkActivityRate!: number;

    @Column({ nullable: false })
    annotation!: string;

    @ManyToOne(() => Server, (server) => server.id, { nullable: false, eager: true })
    @JoinColumn({ name: 'server_id', foreignKeyConstraintName: 'FK_SERVER' })
    server!: Relation<Server>;
}
