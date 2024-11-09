import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateUserDto } from './dtos/create.user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @Get(':uuid')
    async getUserByUuid(@Param('uuid') uuid: string): Promise<User | null> {
        return this.userService.getUserByUuid(uuid);
    }
}
