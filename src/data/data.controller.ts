import { Controller, Post, Body } from '@nestjs/common';
import { DataService } from './data.service';
import { Data } from 'src/entities/data.entity';


@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('create')
  async createData(@Body() data: Partial<Data>): Promise<Data> {
    return this.dataService.create(data);
  }
}
