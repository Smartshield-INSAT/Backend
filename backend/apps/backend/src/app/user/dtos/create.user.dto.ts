import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(60)
    email!: string;
}
