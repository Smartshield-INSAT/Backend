import { Body, Controller, Post } from '@nestjs/common';

import { NamingService } from './naming.service';
import { CreateNamingDto } from './dto/create-naming.dto';

@Controller('naming')
export class NamingController {
    constructor(private readonly namingService: NamingService) {}

    @Post()
    async createNaming(@Body() createNamingDto: CreateNamingDto) {
        return this.namingService.createNaming(createNamingDto);
    }
}
