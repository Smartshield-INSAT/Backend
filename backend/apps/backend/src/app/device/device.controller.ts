import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { DeviceSpecsDto } from './device-specs.dto';
import { DeviceService } from './device.service';

@Controller('devices')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {}

    @Post()
    async createOrUpdateDevice(@Body() deviceSpecsDto: DeviceSpecsDto): Promise<{ id: string }> {
        return await this.deviceService.createOrUpdateDevice(deviceSpecsDto);
    }

    @Get('/id/:id')
    async getDeviceById(@Param('id') id: string) {
        return this.deviceService.getDeviceById(id);
    }

    @Get('/mac/:macAddress')
    async getDeviceByMacAddress(@Param('macAddress') macAddress: string) {
        return this.deviceService.getDeviceByMacAddress(macAddress);
    }
}
