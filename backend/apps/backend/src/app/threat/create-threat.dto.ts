import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateThreatDto {
    @IsNotEmpty()
    title!: string;

    @IsOptional()
    description?: string;

    @IsNotEmpty()
    severity!: string;
}
