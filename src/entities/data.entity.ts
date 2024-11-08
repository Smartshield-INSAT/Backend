import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Server } from './server.entity';

@Entity('data')
export class Data {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  dur: number;

  @Column('varchar', { length: 50 })
  proto: string;

  @Column('varchar', { length: 50 })
  service: string;

  @Column('varchar', { length: 50 })
  state: string;

  @Column('float')
  spkts: number;

  @Column('float')
  dpkts: number;

  @Column('float')
  sbytes: number;

  @Column('float')
  dbytes: number;

  @Column('float')
  sload: number;

  @Column('float')
  dloss: number;

  @Column('float')
  dinpkt: number;

  @Column('float')
  tcprtt: number;

  @Column('float')
  smean: number;

  @Column('float')
  trans_depth: number;

  @Column('float')
  ct_src_dport_ltm: number;

  @Column('float')
  is_ftp_login: number;

  @Column('float')
  ct_flw_http_mthd: number;

  @Column('float', { name: 'Speed_of_Operations_to_Speed_of_Data_Bytes' })
  speedOfOperationsToSpeedOfDataBytes: number;

  @Column('float', { name: 'Time_for_a_Single_Process' })
  timeForASingleProcess: number;

  @Column('float', { name: 'Ratio_of_Data_Flow' })
  ratioOfDataFlow: number;

  @Column('float', { name: 'Ratio_of_Packet_Flow' })
  ratioOfPacketFlow: number;

  @Column('float', { name: 'Total_Page_Errors' })
  totalPageErrors: number;

  @Column('float', { name: 'Network_Usage' })
  networkUsage: number;

  @Column('float', { name: 'Network_Activity_Rate' })
  networkActivityRate: number;



  @ManyToOne(() => Server, server => server.id, { eager: true })
  @JoinColumn({ name: 'server_id' })
  server_id: Server;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
