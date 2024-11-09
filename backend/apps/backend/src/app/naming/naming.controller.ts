import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateNamingDto } from './dto/create-naming.dto';
import { NamingService } from './naming.service';

@ApiTags('naming')
@Controller('naming')
export class NamingController {
    constructor(private readonly namingService: NamingService) {}

    @Post()
    @ApiOperation({ summary: 'Post new Naming' })
    @ApiBody({ type: CreateNamingDto })
    async createNaming(@Body() createNamingDto: CreateNamingDto) {
        return this.namingService.createNaming(createNamingDto);
    }
}
