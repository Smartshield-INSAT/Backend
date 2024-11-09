import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseService } from '../common/data_layer/base.service';
import { ServerService } from '../server/server.service';

import { CreateDataDto } from './dtos/create-data.dto';
import { Data } from './entity/data.entity';

import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class DataService extends BaseService<Data> {
    constructor(
        @InjectRepository(Data)
        dataRepository: Repository<Data>,
        private readonly serverService: ServerService,
    ) {
        super(dataRepository);
    }

    async createData(createDataDto: CreateDataDto): Promise<Data> {
        const { serverId, ...dataFields } = createDataDto;

        // Find the server by ID
        const server = await this.serverService.getServerById(serverId);
        if (!server) {
            throw new NotFoundException(`Server with ID ${serverId} not found`);
        }

        return firstValueFrom(
            this.save({
                ...dataFields,
                server,
            }),
        );
    }

    // Get all data records
    async getAllData(): Promise<Data[]> {
        return await firstValueFrom(this.findAll());
    }

    // Get a data record by ID
    async getDataById(id: number): Promise<Data> {
        const dataEntry = await firstValueFrom(this.findOne({ where: { id } }));
        if (!dataEntry) {
            throw new NotFoundException(`Data with ID ${id} not found`);
        }
        return dataEntry;
    }
    async getAllDataForIP(ip: string): Promise<Data[]> {
      const dataEntry = await firstValueFrom(this.findAll({ where: { ip } }));
      if (!dataEntry) {
          throw new NotFoundException(`Data with ID ${ip} not found`);
      }
      return dataEntry;
  }
}
