import { Module } from '@nestjs/common';

import { NamingController } from './naming.controller';
import { NamingService } from './naming.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Data } from '../data/entity/data.entity';
import { User } from '../user/entity/user.entity';
import { Server } from '../server/entity/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Data, Server, User])],
    controllers: [NamingController],
    providers: [NamingService],
})
export class NamingModule {}
