import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { DataService, ServerCountResponse } from './data.service';
import { CreateDataDto } from './dtos/create-data.dto';
import { Data } from './entity/data.entity';

@Controller('data')
export class DataController {
    constructor(private readonly dataService: DataService) {}

    @Post()
    async createData(@Body() createDataDto: CreateDataDto): Promise<Data> {
        return this.dataService.createData(createDataDto);
    }

    @Get()
    async getAllData(): Promise<Data[]> {
        return this.dataService.getAllData();
    }

    // Base count endpoints
    @Get('count')
    async getDataCount(): Promise<number> {
        return await this.dataService.countDataEntries();
    }

    @Get('servers/count')
    async getServerCount(): Promise<number> {
        return await this.dataService.countServerEntries();
    }

    @Get('unique-ips/count')
    async getUniqueIpCount(): Promise<number> {
        return await this.dataService.countUniqueIPs();
    }

    @Get('count-by-annotation')
    async getCountByAnnotation(): Promise<{ annotation: string; count: number }[]> {
        return await this.dataService.countByAnnotation();
    }

    @Get('count-by-id')
    async getCountById(): Promise<{ id: number; count: number }[]> {
        return await this.dataService.countById();
    }

    @Get('count-by-ip-top-5')
    async getCountByIpTop5(): Promise<{ ip: string; count: number }[]> {
        return await this.dataService.getTop5IPs();
    }

    // Threat endpoints
    @Get('threats')
    async getAllThreats(): Promise<Data[]> {
        return await this.dataService.getAllThreats();
    }

    @Get('threats/recent')
    async getRecentThreats(): Promise<Data[]> {
        return await this.dataService.getRecentThreats();
    }

    // Last 5 minutes endpoints
    @Get('count/last-5-min')
    async getDataCountLast5Min(): Promise<number> {
        return await this.dataService.countDataEntriesLast5Min();
    }

    @Get('servers/count/last-5-min')
    async getServerCountLast5Min(): Promise<number> {
        return await this.dataService.countServerEntriesLast5Min();
    }

    @Get('unique-ips/count/last-5-min')
    async getUniqueIpCountLast5Min(): Promise<number> {
        return await this.dataService.countUniqueIPsLast5Min();
    }

    @Get('count-by-annotation/last-5-min')
    async getCountByAnnotationLast5Min(): Promise<{ annotation: string; count: number }[]> {
        return await this.dataService.countByAnnotationLast5Min();
    }

    @Get('count-by-id/last-5-min')
    async getCountByIdLast5Min(): Promise<{ id: number; count: number }[]> {
        return await this.dataService.countByIdLast5Min();
    }

    @Get('count-by-ip-top-5/last-5-min')
    async getCountByIpTop5Last5Min(): Promise<{ ip: string; count: number }[]> {
        return await this.dataService.getTop5IPsLast5Min();
    }

    @Get('threats/last-5-min')
    async getAllThreatsLast5Min(): Promise<Data[]> {
        return await this.dataService.getAllThreatsLast5Min();
    }

    @Get('threats/recent/last-5-min')
    async getRecentThreatsLast5Min(): Promise<Data[]> {
        return await this.dataService.getRecentThreatsLast5Min();
    }

    @Get('count-by-server')
    async getCountByServer(): Promise<ServerCountResponse[]> {
        return await this.dataService.countByServerWithNames();
    }

    @Get('count-by-server-top-5')
    async getCountByServerTop5(): Promise<ServerCountResponse[]> {
        return await this.dataService.getTop5ServersWithNames();
    }

    @Get('count-by-server/last-5-min')
    async getCountByServerLast5Min(): Promise<ServerCountResponse[]> {
        return await this.dataService.countByServerWithNamesLast5Min();
    }

    @Get('count-by-server-top-5/last-5-min')
    async getCountByServerTop5Last5Min(): Promise<ServerCountResponse[]> {
        return await this.dataService.getTop5ServersWithNamesLast5Min();
    }

    // Individual record endpoints
    @Get('id/:id')
    async getDataById(@Param('id') id: number): Promise<Data> {
        return this.dataService.getDataById(id);
    }

    @Get('ip/:ip')
    async getAllDataForIP(@Param('ip') ip: string): Promise<Data[]> {
        return this.dataService.getAllDataForIP(ip);
    }
}
