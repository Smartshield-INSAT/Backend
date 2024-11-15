import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Redis from 'ioredis';

@Global()
@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: async (configService: ConfigService) => {
                const host = configService.get<string>('REDIS_HOST');
                const port = configService.get<number>('REDIS_PORT');
                console.log(`Connecting to Redis at ${host}:${port}`);

                return new Redis({
                    host,
                    port,
                    connectTimeout: 10000,
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
