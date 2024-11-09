import { Body, Controller, Post } from '@nestjs/common';

import { CreateNamingDto } from './dto/create-naming.dto';
import { NamingService } from './naming.service';

@Controller('naming')
export class NamingController {
    constructor(private readonly namingService: NamingService) {}

    @Post()
    async createNaming(@Body() createNamingDto: CreateNamingDto) {
        return this.namingService.createNaming(createNamingDto);
    }
}
