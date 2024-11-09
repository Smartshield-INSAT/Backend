import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Server } from '../server/entity/server.entity';
import { User } from '../user/entity/user.entity';

import { Naming } from './entity/naming.entity';
import { NamingController } from './naming.controller';
import { NamingService } from './naming.service';

@Module({
    imports: [TypeOrmModule.forFeature([Server, User, Naming])],
    controllers: [NamingController],
    providers: [NamingService],
})
export class NamingModule {}
