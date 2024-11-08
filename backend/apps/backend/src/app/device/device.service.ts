import { Inject, Injectable } from '@nestjs/common';

import { DeviceSpecsDto } from './device-specs.dto';

import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeviceService {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    async createOrUpdateDevice(deviceSpecsDto: DeviceSpecsDto) {
        const { macAddresses, ...deviceData } = deviceSpecsDto;

        let existingUuid = null;
        for (const mac of macAddresses) {
            const uuid = await this.redisClient.get(mac);
            if (uuid) {
                existingUuid = uuid;
                break;
            }
        }
        const uuid = existingUuid || uuidv4();
        for (const mac of macAddresses) {
            await this.redisClient.set(mac, uuid);
        }
        await this.redisClient.set(uuid, JSON.stringify({ ...deviceData, macAddresses }));
        return { id: uuid };
    }

    async getDeviceById(id: string) {
        const deviceData = await this.redisClient.get(id);
        if (deviceData) {
            return JSON.parse(deviceData);
        }
        return null;
    }

    async getDeviceByMacAddress(macAddress: string) {
        const uuid = await this.redisClient.get(macAddress);
        if (uuid) {
            return this.getDeviceById(uuid);
        }
        return null;
    }
}
