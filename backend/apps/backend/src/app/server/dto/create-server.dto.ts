import { ArrayNotEmpty, IsArray, IsMACAddress, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateServerDto {
    @IsUUID()
    @IsNotEmpty()
    userUuid!: string;

    @IsString()
    @IsNotEmpty()
    hostname!: string;

    @IsString()
    @IsNotEmpty()
    os!: string;

    @IsString()
    @IsNotEmpty()
    arch!: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsMACAddress({ each: true })
    macAddresses!: string[];
}
