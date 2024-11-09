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
        repository: Repository<Data>,
        private readonly serverService: ServerService,
    ) {
        super(repository);
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

    // 1. Count all entries in Data
    async countDataEntries(): Promise<number> {
        return await this.repository.count();
    }

    // 2. Count all entries in Server
    async countServerEntries(): Promise<number> {
        return await this.serverService.countServerEntries();
    }

    // 3. Count unique IP entries in Data
    async countUniqueIPs(): Promise<number> {
        const result = await this.repository
            .createQueryBuilder('data')
            .select('COUNT(DISTINCT(data.ip))', 'count')
            .getRawOne();

        return parseInt(result.count, 10);
    }

    // 4. Count entries grouped by annotation in Data
    async countByAnnotation(): Promise<{ annotation: string; count: number }[]> {
        const results = await this.repository
            .createQueryBuilder('data')
            .select('data.annotation', 'annotation')
            .addSelect('COUNT(*)', 'count')
            .groupBy('data.annotation')
            .getRawMany();

        return results.map((result) => ({
            annotation: result.annotation,
            count: parseInt(result.count, 10),
        }));
    }

    // 5. Count entries grouped by ID in Data
    async countById(): Promise<{ id: number; count: number }[]> {
        const results = await this.repository
            .createQueryBuilder('data')
            .select('data.id', 'id')
            .addSelect('COUNT(*)', 'count')
            .groupBy('data.id')
            .getRawMany();

        return results.map((result) => ({
            id: parseInt(result.id, 10),
            count: parseInt(result.count, 10),
        }));
    }

    // 6. Count entries grouped by server in Data
    async countByServer(): Promise<{ serverId: string; count: number }[]> {
        const results = await this.repository
            .createQueryBuilder('data')
            .select('data.server.id', 'serverId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('data.server.id')
            .getRawMany();

        return results.map((result) => ({
            serverId: result.serverId,
            count: parseInt(result.count, 10),
        }));
    }

    // Method to get the top 5 most frequent IPs
  async getTop5IPs(): Promise<{ ip: string; count: number }[]> {
    const results = await this.repository
      .createQueryBuilder('data')
      .select('data.ip', 'ip')
      .addSelect('COUNT(*)', 'count')
      .groupBy('data.ip')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    return results.map(result => ({
      ip: result.ip,
      count: parseInt(result.count, 10),
    }));
  }
}
