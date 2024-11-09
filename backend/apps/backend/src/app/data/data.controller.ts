import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiProperty } from '@nestjs/swagger';
import { DataService, ServerCountResponse } from './data.service';
import { CreateDataDto } from './dtos/create-data.dto';
import { Data } from './entity/data.entity';

@ApiTags('data')
@Controller('data')
export class DataController {
    constructor(private readonly dataService: DataService) {}

    @Post()
    @ApiOperation({ summary: 'Create new data entry' })
    @ApiBody({ type: CreateDataDto })
    @ApiResponse({ status: 201, description: 'The data has been successfully created.', type: Data })
    async createData(@Body() createDataDto: CreateDataDto): Promise<Data> {
        return this.dataService.createData(createDataDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all data entries' })
    @ApiResponse({ status: 200, description: 'Returns all data entries', type: [Data] })
    async getAllData(): Promise<Data[]> {
        return this.dataService.getAllData();
    }

    @Get('count')
    @ApiOperation({ summary: 'Get total count of data entries' })
    @ApiResponse({ status: 200, description: 'Returns the total count of data entries', type: Number })
    async getDataCount(): Promise<number> {
        return await this.dataService.countDataEntries();
    }

    @Get('servers/count')
    @ApiOperation({ summary: 'Get total count of server entries' })
    @ApiResponse({ status: 200, description: 'Returns the total count of server entries', type: Number })
    async getServerCount(): Promise<number> {
        return await this.dataService.countServerEntries();
    }

    @Get('unique-ips/count')
    @ApiOperation({ summary: 'Get count of unique IPs' })
    @ApiResponse({ status: 200, description: 'Returns the count of unique IPs', type: Number })
    async getUniqueIpCount(): Promise<number> {
        return await this.dataService.countUniqueIPs();
    }

    @Get('count-by-annotation')
    @ApiOperation({ summary: 'Get count grouped by annotation' })
    @ApiResponse({
        status: 200,
        description: 'Returns counts grouped by annotation',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    annotation: { type: 'string' },
                    count: { type: 'number' }
                }
            }
        }
    })
    async getCountByAnnotation(): Promise<{ annotation: string; count: number }[]> {
        return await this.dataService.countByAnnotation();
    }

    @Get('count-by-id')
    @ApiOperation({ summary: 'Get count grouped by ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns counts grouped by ID',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    count: { type: 'number' }
                }
            }
        }
    })
    async getCountById(): Promise<{ id: number; count: number }[]> {
        return await this.dataService.countById();
    }

    @Get('count-by-ip-top-5')
    @ApiOperation({ summary: 'Get top 5 IPs by count' })
    @ApiResponse({
        status: 200,
        description: 'Returns top 5 IPs and their counts',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    ip: { type: 'string' },
                    count: { type: 'number' }
                }
            }
        }
    })
    async getCountByIpTop5(): Promise<{ ip: string; count: number }[]> {
        return await this.dataService.getTop5IPs();
    }

    @Get('threats')
    @ApiOperation({ summary: 'Get all threats' })
    @ApiResponse({ status: 200, description: 'Returns all threats', type: [Data] })
    async getAllThreats(): Promise<Data[]> {
        return await this.dataService.getAllThreats();
    }

    @Get('threats/recent')
    @ApiOperation({ summary: 'Get recent threats' })
    @ApiResponse({ status: 200, description: 'Returns recent threats', type: [Data] })
    async getRecentThreats(): Promise<Data[]> {
        return await this.dataService.getRecentThreats();
    }

    // Last 5 minutes endpoints
    @Get('count/last-5-min')
    @ApiOperation({ summary: 'Get data count for last 5 minutes' })
    @ApiResponse({ status: 200, description: 'Returns data count for last 5 minutes', type: Number })
    async getDataCountLast5Min(): Promise<number> {
        return await this.dataService.countDataEntriesLast5Min();
    }

    @Get('servers/count/last-5-min')
    @ApiOperation({ summary: 'Get server count for last 5 minutes' })
    @ApiResponse({ status: 200, description: 'Returns server count for last 5 minutes', type: Number })
    async getServerCountLast5Min(): Promise<number> {
        return await this.dataService.countServerEntriesLast5Min();
    }

    @Get('unique-ips/count/last-5-min')
    @ApiOperation({ summary: 'Get unique IPs count for last 5 minutes' })
    @ApiResponse({ status: 200, description: 'Returns unique IPs count for last 5 minutes', type: Number })
    async getUniqueIpCountLast5Min(): Promise<number> {
        return await this.dataService.countUniqueIPsLast5Min();
    }

    @Get('count-by-annotation/last-5-min')
    @ApiOperation({ summary: 'Get count by annotation for last 5 minutes' })
    @ApiResponse({
        status: 200,
        description: 'Returns counts by annotation for last 5 minutes',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    annotation: { type: 'string' },
                    count: { type: 'number' }
                }
            }
        }
    })
    async getCountByAnnotationLast5Min(): Promise<{ annotation: string; count: number }[]> {
        return await this.dataService.countByAnnotationLast5Min();
    }

    @Get('count-by-server')
    @ApiOperation({ summary: 'Get count by server with names' })
    @ApiResponse({ status: 200, description: 'Returns counts by server with names', type: [ServerCountResponseDto] })
    async getCountByServer(): Promise<ServerCountResponse[]> {
        return await this.dataService.countByServerWithNames();
    }

    @Get('count-by-server-top-5')
    @ApiOperation({ summary: 'Get top 5 servers by count with names' })
    @ApiResponse({ status: 200, description: 'Returns top 5 servers by count with names', type: [ServerCountResponseDto] })
    async getCountByServerTop5(): Promise<ServerCountResponse[]> {
        return await this.dataService.getTop5ServersWithNames();
    }

    @Get('id/:id')
    @ApiOperation({ summary: 'Get data by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'Data ID' })
    @ApiResponse({ status: 200, description: 'Returns data for the specified ID', type: Data })
    @ApiResponse({ status: 404, description: 'Data not found' })
    async getDataById(@Param('id') id: number): Promise<Data> {
        return this.dataService.getDataById(id);
    }

    @Get('ip/:ip')
    @ApiOperation({ summary: 'Get all data for specific IP' })
    @ApiParam({ name: 'ip', type: 'string', description: 'IP address' })
    @ApiResponse({ status: 200, description: 'Returns all data for the specified IP', type: [Data] })
    async getAllDataForIP(@Param('ip') ip: string): Promise<Data[]> {
        return this.dataService.getAllDataForIP(ip);
    }
}

class ServerCountResponseDto {
    @ApiProperty()
    serverId!: string;

    @ApiProperty()
    hostname!: string;

    @ApiProperty({ required: false })
    naming?: string;

    @ApiProperty()
    count!: number;
}
