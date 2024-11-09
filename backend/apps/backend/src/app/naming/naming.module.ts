import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Data } from '../data/entity/data.entity';
import { Server } from '../server/entity/server.entity';
import { User } from '../user/entity/user.entity';

import { NamingController } from './naming.controller';
import { NamingService } from './naming.service';

@Module({
    imports: [TypeOrmModule.forFeature([Data, Server, User])],
    controllers: [NamingController],
    providers: [NamingService],
})
export class NamingModule {}
