import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dtos/create.user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Post new user' })
    @ApiBody({ type: CreateUserDto })
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get users' })
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @Get(':uuid')
    @ApiOperation({ summary: 'Get user using uuid' })
    @ApiParam({ name: 'uuid', type: String, required: true })
    async getUserByUuid(@Param('uuid') uuid: string): Promise<User | null> {
        return this.userService.getUserByUuid(uuid);
    }
}
