import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseService } from '../common/data_layer/base.service';
import { NamingService } from '../naming/naming.service';
import { ServerService } from '../server/server.service';

import { CreateDataDto } from './dtos/create-data.dto';
import { Data } from './entity/data.entity';

import { firstValueFrom } from 'rxjs';
import { In, MoreThan, Not, Repository } from 'typeorm';

export interface ServerCountResponse {
    serverId: string;
    hostname: string;
    naming?: string; // Optional naming from the Naming entity
    count: number;
}

const getFiveMinutesAgo = (): Date => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 5);
    return date;
};
@Injectable()
export class DataService extends BaseService<Data> {
    constructor(
        @InjectRepository(Data)
        repository: Repository<Data>,
        private readonly serverService: ServerService,
        private readonly namingService: NamingService,
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
            .select('data.server_id', 'serverId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('data.server_id')
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

        return results.map((result) => ({
            ip: result.ip,
            count: parseInt(result.count, 10),
        }));
    }

    async countByServerWithNames(): Promise<ServerCountResponse[]> {
        const baseQuery = await this.repository
            .createQueryBuilder('data')
            .select('data.server_id', 'serverId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('data.server_id');

        const counts = await baseQuery.getRawMany();

        return await this.enrichServerInfo(counts);
    }

    async getTop5ServersWithNames(): Promise<ServerCountResponse[]> {
        const baseQuery = await this.repository
            .createQueryBuilder('data')
            .select('data.server_id', 'serverId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('data.server_id')
            .orderBy('count', 'DESC')
            .limit(5);

        const counts = await baseQuery.getRawMany();

        return await this.enrichServerInfo(counts);
    }

    async countByServerWithNamesLast5Min(): Promise<ServerCountResponse[]> {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const baseQuery = await this.repository
            .createQueryBuilder('data')
            .select('data.server_id', 'serverId')
            .addSelect('COUNT(*)', 'count')
            .where('data.created_at >= :fiveMinutesAgo', { fiveMinutesAgo })
            .groupBy('data.server_id');

        const counts = await baseQuery.getRawMany();

        return await this.enrichServerInfo(counts);
    }

    async getTop5ServersWithNamesLast5Min(): Promise<ServerCountResponse[]> {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const baseQuery = await this.repository
            .createQueryBuilder('data')
            .select('data.server_id', 'serverId')
            .addSelect('COUNT(*)', 'count')
            .where('data.created_at >= :fiveMinutesAgo', { fiveMinutesAgo })
            .groupBy('data.server_id')
            .orderBy('count', 'DESC')
            .limit(5);

        const counts = await baseQuery.getRawMany();

        return await this.enrichServerInfo(counts);
    }

    private async enrichServerInfo(
        counts: { serverId: string; count: string }[],
    ): Promise<ServerCountResponse[]> {
        const enriched = await Promise.all(
            counts.map(async ({ serverId, count }) => {
                const server = await firstValueFrom(
                    this.serverService.findOne({
                        where: { id: serverId },
                    }),
                );

                if (!server) {
                    return {
                        serverId,
                        hostname: 'Unknown Server',
                        count: parseInt(count, 10),
                    };
                }

                const naming = await firstValueFrom(
                    this.namingService.findOne({
                        where: { ip: In(server.macAddresses) },
                    }),
                );

                return {
                    serverId,
                    hostname: server.hostname,
                    ...(naming && { naming: naming.name }),
                    count: parseInt(count, 10),
                };
            }),
        );

        return enriched;
    }

    // Method to get the top 5 most risky servers
    async getTop5Serverss(): Promise<{ serverId: string; count: number }[]> {
        const results = await this.repository
            .createQueryBuilder('data')
            .select('data.server_id', 'serverId')
            .addSelect('COUNT(*)', 'count')
            .groupBy('data.server_id')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany();

        return results.map((result) => ({
            serverId: result.serverId,
            count: parseInt(result.count, 10),
        }));
    }

    // Retrieve all threats (any entry with annotation not equal to "BENIGN")
    async getAllThreats(): Promise<Data[]> {
        return await this.repository.find({
            where: { annotation: Not('BENIGN') },
            order: { created_at: 'DESC' },
        });
    }

    // Retrieve the 3 most recent threats (any entry with annotation not equal to "BENIGN")
    async getRecentThreats(): Promise<Data[]> {
        return await this.repository.find({
            where: { annotation: Not('BENIGN') },
            order: { created_at: 'DESC' },
            take: 3,
        });
    }

    async countDataEntriesLast5Min(): Promise<number> {
        const fiveMinutesAgo = getFiveMinutesAgo();
        return this.repository.count({
            where: { created_at: MoreThan(fiveMinutesAgo) },
        });
    }

    async countServerEntriesLast5Min(): Promise<number> {
        return this.serverService.countServerEntriesLast5Min();
    }

    async countUniqueIPsLast5Min(): Promise<number> {
        const fiveMinutesAgo = getFiveMinutesAgo();
        const result = await this.repository
            .createQueryBuilder('data')
            .select('COUNT(DISTINCT(data.ip))', 'count')
            .where('data.created_at > :date', { date: fiveMinutesAgo })
            .getRawOne();

        return parseInt(result.count, 10);
    }

    async countByAnnotationLast5Min(): Promise<{ annotation: string; count: number }[]> {
        const fiveMinutesAgo = getFiveMinutesAgo();
        const results = await this.repository
            .createQueryBuilder('data')
            .select('data.annotation', 'annotation')
            .addSelect('COUNT(*)', 'count')
            .where('data.created_at > :date', { date: fiveMinutesAgo })
            .groupBy('data.annotation')
            .getRawMany();

        return results.map((result) => ({
            annotation: result.annotation,
            count: parseInt(result.count, 10),
        }));
    }

    async countByIdLast5Min(): Promise<{ id: number; count: number }[]> {
        const fiveMinutesAgo = getFiveMinutesAgo();
        const results = await this.repository
            .createQueryBuilder('data')
            .select('data.id', 'id')
            .addSelect('COUNT(*)', 'count')
            .where('data.created_at > :date', { date: fiveMinutesAgo })
            .groupBy('data.id')
            .getRawMany();

        return results.map((result) => ({
            id: parseInt(result.id, 10),
            count: parseInt(result.count, 10),
        }));
    }

    async countByServerLast5Min(): Promise<{ serverId: string; count: number }[]> {
        const fiveMinutesAgo = getFiveMinutesAgo();
        const results = await this.repository
            .createQueryBuilder('data')
            .select('data.server_id', 'serverId')
            .addSelect('COUNT(*)', 'count')
            .where('data.created_at > :date', { date: fiveMinutesAgo })
            .groupBy('data.server_id')
            .getRawMany();

        return results.map((result) => ({
            serverId: result.serverId,
            count: parseInt(result.count, 10),
        }));
    }

    async getTop5IPsLast5Min(): Promise<{ ip: string; count: number }[]> {
        const fiveMinutesAgo = getFiveMinutesAgo();
        const results = await this.repository
            .createQueryBuilder('data')
            .select('data.ip', 'ip')
            .addSelect('COUNT(*)', 'count')
            .where('data.created_at > :date', { date: fiveMinutesAgo })
            .groupBy('data.ip')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany();

        return results.map((result) => ({
            ip: result.ip,
            count: parseInt(result.count, 10),
        }));
    }

    async getTop5ServersLast5Min(): Promise<{ serverId: string; count: number }[]> {
        const fiveMinutesAgo = getFiveMinutesAgo();
        const results = await this.repository
            .createQueryBuilder('data')
            .select('data.server_id', 'serverId')
            .addSelect('COUNT(*)', 'count')
            .where('data.created_at > :date', { date: fiveMinutesAgo })
            .groupBy('data.server_id')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany();

        return results.map((result) => ({
            serverId: result.serverId,
            count: parseInt(result.count, 10),
        }));
    }

    async getAllThreatsLast5Min(): Promise<Data[]> {
        const fiveMinutesAgo = getFiveMinutesAgo();
        return await this.repository.find({
            where: {
                annotation: Not('BENIGN'),
                created_at: MoreThan(fiveMinutesAgo),
            },
            order: { created_at: 'DESC' },
        });
    }

    async getRecentThreatsLast5Min(): Promise<Data[]> {
        const fiveMinutesAgo = getFiveMinutesAgo();
        return await this.repository.find({
            where: {
                annotation: Not('BENIGN'),
                created_at: MoreThan(fiveMinutesAgo),
            },
            order: { created_at: 'DESC' },
            take: 3,
        });
    }
}
