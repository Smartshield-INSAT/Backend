import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DataLayerModule } from './common/data_layer/data.layer.module';
import { Entities } from './common/entities/entities';
import { RedisModule } from './redis/redis.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => {
                const numberProduction = config.get<number>('PROD');
                const isProduction = numberProduction == 0 ? false : true;
                const databaseUrl = config.get<string>('DATABASE_URL');

                const connectionOptions: TypeOrmModuleOptions = databaseUrl
                    ? {
                          type: 'postgres',
                          url: databaseUrl,
                      }
                    : {
                          type: 'postgres',
                          host: config.get<string>('DB_HOST'),
                          port: config.get<number>('DB_PORT'),
                          username: config.get<string>('DB_USERNAME'),
                          password: config.get<string>('DB_PASSWORD'),
                          database: config.get<string>('DB_NAME'),
                      };
                console.log(connectionOptions);

                return {
                    ...connectionOptions,
                    entities: Entities,
                    synchronize: !isProduction, // never use True in production
                    logging: !isProduction, // log all the queries
                    cache: isProduction
                        ? {
                              duration: 3_600_000, // Cache for 1 hour
                          }
                        : false,
                };
            },
        }),
        RedisModule,
        DataLayerModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
