import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateServerDto } from './dto/create-server.dto';
import { Server } from './entity/server.entity';
import { ServerService } from './server.service';

@Controller('server')
export class ServerController {
    constructor(private readonly serverService: ServerService) {}

    @Post()
    async createServer(@Body() createServerDto: CreateServerDto): Promise<Server> {
        return this.serverService.createServer(createServerDto);
    }
    @Get()
    async getAllServers(): Promise<Server[]> {
        return this.serverService.getAllServers();
    }
    @Get(':id')
    async getServerById(@Param('id') id: string): Promise<Server> {
        return this.serverService.getServerById(id);
    }
    @Get('/user/:userUuid')
    async getServersByUserUuid(@Param('userUuid') userUuid: string): Promise<Server[]> {
        return this.serverService.getServersByUserUuid(userUuid);
    }
}
