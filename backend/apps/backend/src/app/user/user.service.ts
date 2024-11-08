import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseService } from '../common/data_layer/base.service';

import { CreateUserDto } from './dtos/create.user.dto';
import { User } from './entity/user.entity';

import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectRepository(User)
        userRepository: Repository<User>,
    ) {
        super(userRepository);
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return await firstValueFrom(this.save(createUserDto));
    }

    async getAllUsers(): Promise<User[]> {
        return await firstValueFrom(this.findAll());
    }

    async getUserByUuid(uuid: string): Promise<User> {
        const user = await firstValueFrom(this.findOne({ where: { uuid } }));
        if (!user) {
            throw new NotFoundException(`User with uuid ${uuid} not found`);
        }
        return user;
    }
}
