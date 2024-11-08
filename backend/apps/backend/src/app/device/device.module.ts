import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Server } from '../server/entity/server.entity';
import { ServerService } from '../server/server.service';
import { User } from '../user/entity/user.entity';

import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
    imports: [TypeOrmModule.forFeature([Server, User])],
    controllers: [DeviceController],
    providers: [DeviceService, ServerService],
})
export class DeviceModule {}
