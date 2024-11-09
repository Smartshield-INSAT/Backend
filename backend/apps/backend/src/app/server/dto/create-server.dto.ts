import {
    ArrayNotEmpty,
    IsArray,
    IsMACAddress,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class CreateServerDto {
    @IsUUID()
    @IsOptional()
    id!: string;

    @IsUUID()
    @IsNotEmpty()
    userUuid!: string | undefined;

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
