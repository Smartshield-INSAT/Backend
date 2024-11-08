import { Body, Controller, Post } from '@nestjs/common';

import { DeviceSpecsDto } from './device-specs.dto';
import { DeviceService } from './device.service';

@Controller('device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {}

    @Post('get-id')
    async getId(@Body() body: DeviceSpecsDto): Promise<{ id: string }> {
        return this.deviceService.handleGetId(body);
    }
}
