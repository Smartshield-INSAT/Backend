import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CreateThreatDto } from './create-threat.dto';
import { Threat } from './threat.entity';
import { ThreatsService } from './threat.service';

@Controller('threats')
export class ThreatsController {
    constructor(private readonly threatsService: ThreatsService) {}

    @Post()
    create(@Body() createThreatDto: CreateThreatDto): Promise<Threat> {
        return this.threatsService.createThreat(createThreatDto);
    }

    @Get()
    findAll(@Query('status') status?: string, @Query('severity') severity?: string): Promise<Threat[]> {
        if (status) {
            return this.threatsService.findByStatus(status);
        }
        if (severity) {
            return this.threatsService.findBySeverity(severity);
        }
        return this.threatsService.findAllThreats();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Threat | null> {
        return this.threatsService.findAThreat(id);
    }
}
