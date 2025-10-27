import { Inject, Injectable } from '@nestjs/common';
import type {
    IOAuthMappers,
    IOAuthProviderInterface,
} from '../oauth.interfaces';
import { ConfigService } from '@nestjs/config';
import { GoogleConfig, CreateOAuthUserDto } from '../oauth.dto';
import { OAUTH_MAPPERS } from '../oauth.constants';

@Injectable()
export class GoogleOAuthProvider implements IOAuthProviderInterface {
    private config: GoogleConfig;

    constructor(
        private configService: ConfigService,
        @Inject(OAUTH_MAPPERS) private readonly oauthMappers: IOAuthMappers
    ) {
        this.config = {
            clientId: this.configService.get<string>('GOOGLE_CLIENT_ID')!,
            clientSecret: this.configService.get<string>(
                'GOOGLE_CLIENT_SECRET'
            )!,
            callbackURL: this.configService.get<string>('GOOGLE_CALLBACK_URL')!,
            scope: this.configService.get<string>('GOOGLE_SCOPE')!.split(' '),
            authURL: this.configService.get<string>('GOOGLE_AUTH_URL')!,
            tokenURL: this.configService.get<string>('GOOGLE_TOKEN_URL')!,
            userInfoURL: this.configService.get<string>(
                'GOOGLE_USER_INFO_URL'
            )!,
        };
    }

    authorize(): string {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.callbackURL,
            scope: this.config.scope.join(' '),
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent',
        });

        return `${this.config.authURL}?${params.toString()}`;
    }

    async callback(code: string): Promise<CreateOAuthUserDto> {
        const tokenResponse = await this.exchangeCodeForToken(code);

        const googleUser = await this.getUserInfo(tokenResponse.access_token);
        const oauthUser: CreateOAuthUserDto =
            this.oauthMappers.googleUserToOAuthUser(googleUser);

        return oauthUser;
    }

    getProviderName(): string {
        return 'google';
    }

    private async exchangeCodeForToken(
        code: string
    ): Promise<{ access_token: string }> {
        const response = await fetch(this.config.tokenURL!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: this.config.callbackURL,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for token');
        }

        return response.json();
    }

    private async getUserInfo(accessToken: string) {
        const response = await fetch(this.config.userInfoURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        return response.json();
    }
}
