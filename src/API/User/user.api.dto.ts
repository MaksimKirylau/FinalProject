import { ApiProperty } from '@nestjs/swagger';
import {
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { PASSWORD_MIN_LENGTH } from '../../Auth/authentification/auth.constants';
import type { Optional } from '../../Utility/global.types';

export class CreateUserDto {
    @ApiProperty({ example: 'Ivan', description: 'Users first name' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Ivanov', description: 'Users last name' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({ example: '11.11.11', description: 'Users first birth date' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    birthDate: string;

    @ApiProperty({ example: 'mail@mail.ru', description: 'Users email' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '12345678', description: 'Users 8-digit password' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    password: string;
}

export class UpdateUserDto {
    @ApiProperty({ example: 'Ivan', description: 'Users first name' })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @ApiProperty({ example: 'Ivanov', description: 'Users last name' })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @ApiProperty({ example: '11.11.11', description: 'Users first birth date' })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    birthDate?: string;
}

export class UserPresentationDto {
    @ApiProperty({ example: '1', description: 'Users id in database' })
    userId: number;
    @ApiProperty({ example: 'customer', description: 'Users role' })
    role: 'admin' | 'customer';
    @ApiProperty({ example: 'Ivan', description: 'Users first name' })
    firstName: string;
    @ApiProperty({ example: 'Ivanov', description: 'Users last name' })
    lastName: string;
    @ApiProperty({ example: '11.11.11', description: 'Users first birth date' })
    birthDate: Optional<string>;
    @ApiProperty({ example: 'mail@mail.ru', description: 'Users email' })
    email: string;
    @ApiProperty({ example: 'image.jpg', description: 'Users profile image' })
    image: string;
    @ApiProperty({
        example: '22.12.22',
        description: 'Users profile creation date',
    })
    createdAt: string;
}

export class UserWithPurchsesPresentationDto {
    @ApiProperty({ example: '1', description: 'Users id in database' })
    userId: number;
    @ApiProperty({ example: 'customer', description: 'Users role' })
    role: 'admin' | 'customer';
    @ApiProperty({ example: 'Ivan', description: 'Users first name' })
    firstName: string;
    @ApiProperty({ example: 'Ivanov', description: 'Users last name' })
    lastName: string;
    @ApiProperty({ example: '11.11.11', description: 'Users first birth date' })
    birthDate: Optional<string>;
    @ApiProperty({ example: 'mail@mail.ru', description: 'Users email' })
    email: string;
    @ApiProperty({ example: 'image.jpg', description: 'Users profile image' })
    image: string;
    @ApiProperty({
        example: '22.12.22',
        description: 'Users profile creation date',
    })
    createdAt: string;
    @ApiProperty({
        example: '["Record 1", "Record 2", "Record 3"]',
        description: 'List of records purchased by user',
    })
    purcases: Optional<string>[];
}
