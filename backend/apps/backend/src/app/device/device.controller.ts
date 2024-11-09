import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { DeviceSpecsDto } from './device-specs.dto';
import { DeviceService } from './device.service';

@ApiTags('devices')
@Controller('devices')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {}

    @Post()
    @ApiOperation({ summary: 'Post new Device' })
    @ApiBody({ type: DeviceSpecsDto })
    async createOrUpdateDevice(@Body() deviceSpecsDto: DeviceSpecsDto): Promise<{ id: string }> {
        return await this.deviceService.createOrUpdateDevice(deviceSpecsDto);
    }

    @Get('/id/:id')
    @ApiOperation({ summary: 'Get Device by Id' })
    @ApiParam({ name: 'id', required: true, type: String })
    async getDeviceById(@Param('id') id: string) {
        return this.deviceService.getDeviceById(id);
    }

    @Get('/mac/:macAddress')
    @ApiOperation({ summary: 'Get Devjce by macAdress' })
    @ApiParam({ name: 'macAddress', required: true, type: String })
    async getDeviceByMacAddress(@Param('macAddress') macAddress: string) {
        return this.deviceService.getDeviceByMacAddress(macAddress);
    }
}
