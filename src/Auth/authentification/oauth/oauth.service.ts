import { Inject, Injectable } from '@nestjs/common';
import { TokenDto } from '../auth.dto';
import { CreateOAuthUserDto } from './oauth.dto';
import { AUTH_SERVICE } from '../auth.constants';
import type { IAuthService } from '../auth.interfaces';
import { USER_SERVICE } from '../../../Domain/User/user.constants';
import type { IUserService } from '../../../Domain/User/user.interfaces';
import { OAUTH_ACCOUNT_SERVICE } from '../../../Domain/OAuthAccount/oauthAccount.constants';
import type { IOAuthAccountService } from '../../../Domain/OAuthAccount/oauthAccount.interfaces';
import { UserDto } from '../../../Domain/User/user.dto';
import { OAuthProviderFactory } from './providers/oauth.provider.factory';

@Injectable()
export class OAuthService {
    constructor(
        private readonly oauthProviderFactory: OAuthProviderFactory,
        @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
        @Inject(USER_SERVICE) private readonly userService: IUserService,
        @Inject(OAUTH_ACCOUNT_SERVICE)
        private readonly oauthAccountService: IOAuthAccountService
    ) {}

    async getAuthorizationUrl(provider: string): Promise<string> {
        return this.oauthProviderFactory.getProvider(provider).authorize();
    }

    async handleOAuthCallback(
        providerName: string,
        code: string
    ): Promise<TokenDto> {
        const provider = this.oauthProviderFactory.getProvider(providerName);
        const oauthUser = await provider.callback(code);
        const user = await this.handleOAuthLogin(providerName, oauthUser);
        return this.authService.login(user);
    }

    async handleOAuthLogin(
        provider: string,
        oauthUser: CreateOAuthUserDto
    ): Promise<UserDto> {
        const oauthAccount =
            await this.oauthAccountService.getAccountByProvider(
                provider,
                oauthUser.providerId
            );

        let user = await this.userService.getUserByEmail(oauthUser.email);

        if (!user) {
            user = await this.userService.createOauthUser(oauthUser);
        }

        if (oauthAccount) {
            return user;
        }

        await this.oauthAccountService.createAccount(provider, oauthUser, user);
        return user;
    }
}
