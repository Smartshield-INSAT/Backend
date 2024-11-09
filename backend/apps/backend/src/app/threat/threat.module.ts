import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThreatsController } from './threat.controller';
import { Threat } from './threat.entity';
import { ThreatsService } from './threat.service';

@Module({
    imports: [TypeOrmModule.forFeature([Threat])],
    controllers: [ThreatsController],
    providers: [ThreatsService],
})
export class ThreatsModule {}
