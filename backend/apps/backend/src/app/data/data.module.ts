import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Server } from '../server/entity/server.entity';
import { ServerService } from '../server/server.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

import { DataController } from './data.controller';
import { DataService } from './data.service';
import { Data } from './entity/data.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Data, Server, User])],
    controllers: [DataController],
    providers: [DataService, ServerService, UserService],
})
export class DataModule {}
