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

    @Get(':id')
    async getDataById(@Param('id') id: number): Promise<Data> {
        return this.dataService.getDataById(id);
    }
}
