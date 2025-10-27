import {
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';
import { PASSWORD_MIN_LENGTH } from './auth.constants';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    password: string;
}

export class TokenDto {
    @ApiProperty({ example: 'some base64 text', description: 'Access token' })
    accessToken: string;
    @ApiProperty({ example: 'some base64 text', description: 'Refresh token' })
    refreshToken: string;
}

export class RefreshTokenDto {
    @ApiProperty({ example: 'some base64 text', description: 'Refresh token' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}

export class JwtPayload {
    userId: number;
    email: string;
    role: 'admin' | 'customer';
}

export class RequestUserDto {
    userId: number;
    email: string;
    role: 'admin' | 'customer';
}
