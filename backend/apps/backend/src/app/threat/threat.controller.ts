import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CreateThreatDto } from './create-threat.dto';
import { Threat } from './threat.entity';
import { ThreatsService } from './threat.service';

@ApiTags('threats')
@Controller('threats')
export class ThreatsController {
    constructor(private readonly threatsService: ThreatsService) {}

    @Post()
    @ApiOperation({ summary: 'Post new threat' })
    @ApiBody({ type: CreateThreatDto })
    create(@Body() createThreatDto: CreateThreatDto): Promise<Threat> {
        return this.threatsService.createThreat(createThreatDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get threats' })
    @ApiQuery({
        name: 'status',
        required: false,
        type: String,
        description: 'status of the threat',
    })
    @ApiQuery({
        name: 'severity',
        required: false,
        type: String,
        description: 'severity of the threat',
    })
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
    @ApiOperation({ summary: 'Get threat' })
    @ApiParam({ name: 'id', type: String, required: true })
    findOne(@Param('id') id: string): Promise<Threat | null> {
        return this.threatsService.findAThreat(id);
    }
}
