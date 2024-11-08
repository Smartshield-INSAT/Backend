import { ArrayNotEmpty, IsArray, IsMACAddress, IsNotEmpty, IsString } from 'class-validator';

export class DeviceSpecsDto {
    @IsString()
    @IsNotEmpty()
    os!: string;

    @IsString()
    @IsNotEmpty()
    arch!: string;

    @IsString()
    @IsNotEmpty()
    hostname!: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsMACAddress({ each: true })
    macAddresses!: string[];
}
