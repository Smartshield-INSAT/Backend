import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateServerDto } from './dto/create-server.dto';
import { Server } from './entity/server.entity';
import { ServerService } from './server.service';

@ApiTags('server')
@Controller('server')
export class ServerController {
    constructor(private readonly serverService: ServerService) {}

    @Post()
    @ApiOperation({ summary: 'Post new server' })
    @ApiBody({ type: CreateServerDto })
    async createServer(@Body() createServerDto: CreateServerDto): Promise<Server> {
        return this.serverService.createServer(createServerDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get Servers' })
    async getAllServers(): Promise<Server[]> {
        return this.serverService.getAllServers();
    }

    @Get('/user/:userUuid')
    @ApiOperation({ summary: 'Get Server by userId' })
    @ApiParam({ name: 'userUuid', required: true, type: String })
    async getServersByUserUuid(@Param('userUuid') userUuid: string): Promise<Server[]> {
        return this.serverService.getServersByUserUuid(userUuid);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get Server by ID' })
    @ApiParam({ name: 'id', required: true, type: String })
    async getServerById(@Param('id') id: string): Promise<Server> {
        return this.serverService.getServerById(id);
    }
}
