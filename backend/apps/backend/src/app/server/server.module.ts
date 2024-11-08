import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

import { Server } from './entity/server.entity';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';

@Module({
    imports: [TypeOrmModule.forFeature([Server, User])],
    controllers: [ServerController],
    providers: [ServerService, UserService],
})
export class ServerModule {}
