import {
    Body,
    Controller,
    Delete,
    HttpStatus,
    Inject,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_SERVICE } from './auth.constants';
import type { IAuthService } from './auth.interfaces';
import { RefreshTokenDto, RequestUserDto, TokenDto } from './auth.dto';
import { CreateUserDto } from '../../API/User/user.api.dto';
import { Public } from '../../Utility/decorators/public.decorator';
import { RequestUser } from '../../Utility/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authService: IAuthService
    ) {}

    @ApiOperation({ summary: 'Login user into system' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Returns access and refresh token',
        type: TokenDto,
    })
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@RequestUser() requestUser: RequestUserDto): Promise<TokenDto> {
        return this.authService.login(requestUser);
    }

    @ApiOperation({
        summary: 'Logout user from system (when access token expires)',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns code 200 upon success',
    })
    @UseGuards(AuthGuard('jwt'))
    @Delete('/logout')
    async logout(@RequestUser() requestUser: RequestUserDto): Promise<void> {
        return this.authService.logout(requestUser.userId);
    }

    @ApiOperation({ summary: 'Registers new user (local)' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Returns access and refresh token',
        type: TokenDto,
    })
    @UseInterceptors(FileInterceptor('image'))
    @Post('/register')
    async register(
        @Body() dto: CreateUserDto,
        @UploadedFile() image
    ): Promise<TokenDto> {
        return await this.authService.register(dto, image);
    }

    @ApiOperation({
        summary: 'Endpoint for updating tokens that about to expire',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns access and refresh token',
        type: TokenDto,
    })
    @UseGuards(AuthGuard('jwt'))
    @Delete('/refresh')
    async refresh(
        @RequestUser() requestUser: RequestUserDto,
        @Body() dto: RefreshTokenDto
    ): Promise<TokenDto> {
        return this.authService.refreshTokens(
            requestUser.userId,
            dto.refreshToken
        );
    }
}
