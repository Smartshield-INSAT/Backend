import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Naming } from '../naming/entity/naming.entity';
import { NamingService } from '../naming/naming.service';
import { Server } from '../server/entity/server.entity';
import { ServerService } from '../server/server.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

import { DataController } from './data.controller';
import { DataService } from './data.service';
import { Data } from './entity/data.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Data, Server, User, Naming])],
    controllers: [DataController],
    providers: [DataService, ServerService, UserService, NamingService],
})
export class DataModule {}
