import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseService } from '../common/data_layer/base.service';

import { CreateThreatDto } from './create-threat.dto';
import { Threat } from './threat.entity';
import { ThreatsGateway } from './threat.gateway';

import { Repository } from 'typeorm';

@Injectable()
export class ThreatsService extends BaseService<Threat> {
    constructor(
        @InjectRepository(Threat)
        threatsRepository: Repository<Threat>,
        private readonly threatsGateway: ThreatsGateway,
    ) {
        super(threatsRepository);
    }

    async createThreat(createThreatDto: CreateThreatDto): Promise<Threat> {
        const threat = this.repository.create(createThreatDto);
        await this.repository.save(threat);

        this.threatsGateway.emitThreatCreated(threat);
        return threat;
    }

    async findAllThreats(): Promise<Threat[]> {
        return this.repository.find({
            order: { created_at: 'DESC' },
        });
    }

    async findAThreat(id: string): Promise<Threat | null> {
        const threat = await this.repository.findOne({ where: { id } });
        if (!threat) {
            return null;
        }
        return threat;
    }

    async findByStatus(status: string): Promise<Threat[]> {
        return this.repository.find({
            where: { status },
            order: { created_at: 'DESC' },
        });
    }

    async findBySeverity(severity: string): Promise<Threat[]> {
        return this.repository.find({
            where: { severity },
            order: { created_at: 'DESC' },
        });
    }
}
