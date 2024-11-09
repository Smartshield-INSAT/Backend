import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseService } from '../common/data_layer/base.service';
import { Server } from '../server/entity/server.entity';

import { CreateNamingDto } from './dto/create-naming.dto';
import { Naming } from './entity/naming.entity';

import { Repository } from 'typeorm';

@Injectable()
export class NamingService extends BaseService<Naming> {
    constructor(
        @InjectRepository(Naming)
        namingRepository: Repository<Naming>,
    ) {
        super(namingRepository);
    }

    async createNaming(createNamingDto: CreateNamingDto): Promise<Naming> {
        const naming = this.repository.create(createNamingDto);
        return this.repository.save(naming);
    }

    async enrichServerWithNaming(server: Server): Promise<{ hostname: string; name?: string }> {
        const namingEntry = await this.repository.findOne({ where: { ip: server.hostname } });
        return namingEntry
            ? { hostname: server.hostname, name: namingEntry.name }
            : { hostname: server.hostname };
    }
}
