import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { DataService } from './data.service';
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

    // Endpoint to get the count of all Data entries
    @Get('count')
    async getDataCount(): Promise<number> {
        return await this.dataService.countDataEntries();
    }

    // Endpoint to get the count of all Server entries
    @Get('servers/count')
    async getServerCount(): Promise<number> {
        return await this.dataService.countServerEntries();
    }

    // Endpoint to get the count of unique IP addresses in Data
    @Get('unique-ips/count')
    async getUniqueIpCount(): Promise<number> {
        return await this.dataService.countUniqueIPs();
    }

    // Endpoint to get count of Data entries grouped by annotation
    @Get('count-by-annotation')
    async getCountByAnnotation(): Promise<{ annotation: string; count: number }[]> {
        return await this.dataService.countByAnnotation();
    }

    // Endpoint to get count of Data entries grouped by ID
    @Get('count-by-id')
    async getCountById(): Promise<{ id: number; count: number }[]> {
        return await this.dataService.countById();
    }

    // Endpoint to get count of Data entries grouped by ID
    @Get('count-by-ip-top-5')
    async getCountByIpTop5(): Promise<{ ip: string; count: number }[]> {
        return await this.dataService.getTop5IPs();
    }

    // Endpoint to get count of Data entries grouped by server
    @Get('count-by-server')
    async getCountByServer(): Promise<{ serverId: string; count: number }[]> {
        return await this.dataService.countByServer();
    }

    // Endpoint to retrieve all threats
    @Get('threats')
    async getAllThreats(): Promise<Data[]> {
        return await this.dataService.getAllThreats();
    }

    // Endpoint to retrieve the 3 most recent threats
    @Get('threats/recent')
    async getRecentThreats(): Promise<Data[]> {
        return await this.dataService.getRecentThreats();
    }

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

    @Get('count-by-server/last-5-min')
    async getCountByServerLast5Min(): Promise<{ serverId: string; count: number }[]> {
        return await this.dataService.countByServerLast5Min();
    }

    @Get('id/:id')
    async getDataById(@Param('id') id: number): Promise<Data> {
        return this.dataService.getDataById(id);
    }

    @Get('ip/:ip')
    async getAllDataForIP(@Param('ip') ip: string): Promise<Data[]> {
        return this.dataService.getAllDataForIP(ip);
    }
}
