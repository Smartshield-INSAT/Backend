import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThreatsController } from './threat.controller';
import { Threat } from './threat.entity';
import { ThreatsGateway } from './threat.gateway';
import { ThreatsService } from './threat.service';

@Module({
    imports: [TypeOrmModule.forFeature([Threat])],
    controllers: [ThreatsController],
    providers: [ThreatsService, ThreatsGateway],
})
export class ThreatsModule {}
