import { Inject, Injectable } from '@nestjs/common';

import { DeviceSpecsDto } from './device-specs.dto';

import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeviceService {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    private async getIdByMac(macAddress: string): Promise<string | null> {
        return this.redisClient.get(`mac:${macAddress}`);
    }

    private async setIdForMac(macAddress: string, id: string): Promise<'OK'> {
        return this.redisClient.set(`mac:${macAddress}`, id);
    }

    private async setSpecsForId(id: string, specs: DeviceSpecsDto): Promise<'OK'> {
        return this.redisClient.set(`id:${id}`, JSON.stringify(specs));
    }

    async handleGetId(body: DeviceSpecsDto): Promise<{ id: string }> {
        const macAddress = body['mac-address'];
        let id = await this.getIdByMac(macAddress);

        if (id) {
            await this.setSpecsForId(id, body);
        } else {
            id = uuidv4();
            await this.setIdForMac(macAddress, id);
            await this.setSpecsForId(id, body);
        }

        return { id };
    }
}
