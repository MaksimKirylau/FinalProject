import {
    Controller,
    Get,
    HttpStatus,
    Inject,
    Param,
    Query,
} from '@nestjs/common';
import { Public } from '../../../Utility/decorators/public.decorator';
import { TokenDto } from '../auth.dto';
import { OAuthService } from './oauth.service';
import { OAUTH_SERVICE } from '../auth.constants';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Public()
@Controller('oauth')
export class OAuthController {
    constructor(
        @Inject(OAUTH_SERVICE) private readonly oauthService: OAuthService
    ) {}

    @ApiOperation({ summary: 'Request for oauth authentification' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns url link to provider login page',
    })
    @Get(':provider')
    public async authorize(
        @Param('provider') providerName: string
    ): Promise<{ authorizationUrl: string }> {
        return {
            authorizationUrl:
                await this.oauthService.getAuthorizationUrl(providerName),
        };
    }

    @ApiOperation({
        summary: 'Callback endpoint for successful oauth authentification',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns access and refresh tokens',
        type: TokenDto,
    })
    @Get(':provider/callback')
    public async callback(
        @Param('provider') providerName: string,
        @Query('code') code: string
    ): Promise<TokenDto> {
        return await this.oauthService.handleOAuthCallback(providerName, code);
    }
}
