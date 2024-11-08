import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseService } from '../common/data_layer/base.service';
import { UserService } from '../user/user.service';

import { CreateServerDto } from './dto/create-server.dto';
import { Server } from './entity/server.entity';

import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class ServerService extends BaseService<Server> {
    constructor(
        @InjectRepository(Server)
        ServerRepository: Repository<Server>,
        private readonly userService: UserService,
    ) {
        super(ServerRepository);
    }

    async createServer(createServerDto: CreateServerDto): Promise<Server> {
        const { userUuid, ...serverData } = createServerDto;

        const user = await this.userService.getUserByUuid(userUuid);
        if (!user) {
            throw new NotFoundException(`User with UUID ${userUuid} not found`);
        }

        return await firstValueFrom(
            this.save({
                ...serverData,
                user,
            }),
        );
    }

    async getAllServers(): Promise<Server[]> {
        return await firstValueFrom(this.findAll());
    }

    async getServerById(id: string): Promise<Server> {
        const server = await this.repository.findOne({ where: { id: id } });
        if (!server) {
            throw new NotFoundException(`Server with ID ${id} not found`);
        }
        return server;
    }

    async getServersByUserUuid(userUuid: string): Promise<Server[]> {
        const user = await this.userService.getUserByUuid(userUuid);
        if (!user) {
            throw new NotFoundException(`User with UUID ${userUuid} not found`);
        }

        return this.repository.find({ where: { user } });
    }
}
