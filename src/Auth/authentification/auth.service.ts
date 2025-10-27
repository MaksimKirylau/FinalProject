import bcrypt from 'bcrypt';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { USER_SERVICE } from '../../Domain/User/user.constants';
import { UserDto } from '../../Domain/User/user.dto';
import type { IUserService } from '../../Domain/User/user.interfaces';
import { CreateUserDto } from '../../API/User/user.api.dto';
import { JwtPayload, RequestUserDto, TokenDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { BCRYPT_SALT } from './auth.constants';
import { Optional } from '../../Utility/global.types';
import {
    AuthenticationException,
    ValidationException,
} from '../../Utility/errors/appExceptions/appException';

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_SERVICE) private readonly userService: IUserService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<UserDto> {
        const user: Optional<UserDto> =
            await this.userService.getUserByEmail(email);

        if (!user) {
            throw new AuthenticationException('Wrond email/password');
        }

        if (user.isOAuthUser) {
            throw new AuthenticationException('Wrond email/password');
        }

        const passwordCheck: boolean = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordCheck) {
            throw new AuthenticationException('Wrond email/password');
        }

        return user;
    }

    async login(dto: RequestUserDto): Promise<TokenDto> {
        const payload: JwtPayload = {
            email: dto.email,
            userId: dto.userId,
            role: dto.role,
        };

        const tokens: TokenDto = {
            accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
        };

        await this.userService.updateRefreshToken(
            dto.userId,
            tokens.refreshToken
        );

        return tokens;
    }

    async logout(userId: number): Promise<void> {
        await this.userService.updateRefreshToken(userId, null);
    }

    async refreshTokens(
        userId: number,
        refreshToken: string
    ): Promise<TokenDto> {
        const user = await this.userService.getUserById(userId);

        if (!user || user.refreshToken !== refreshToken) {
            throw new BadRequestException('Invalid refresh token');
        }

        return this.login(user);
    }

    async register(dto: CreateUserDto, image): Promise<TokenDto> {
        const candidate: Optional<UserDto> =
            await this.userService.getUserByEmail(dto.email);

        if (candidate) {
            throw new ValidationException(
                'A user with this email already exists.',
                dto.email
            );
        }

        const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT);
        const newUser: CreateUserDto = { ...dto, password: hashedPassword };

        const user: UserDto = await this.userService.createUser(newUser, image);

        return this.login(user);
    }
}
