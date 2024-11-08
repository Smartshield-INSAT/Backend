import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { Data } from 'src/entities/data.entity';
import { Server } from 'src/entities/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Data, Server])],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
