import { Inject, Injectable, Logger } from '@nestjs/common';
import { OAUTH_ACCOUNT_REPOSITORY } from './oauthAccount.constants';
import type {
    IOAuthAccountRepository,
    IOAuthAccountService,
} from './oauthAccount.interfaces';
import { CreateOAuthUserDto } from '../../Auth/authentification/oauth/oauth.dto';
import { UserDto } from '../User/user.dto';
import { OAuthAccountDto } from './oauthAccount.dto';
import { Optional } from '../../Utility/global.types';
import { ValidationException } from '../../Utility/errors/appExceptions/appException';

@Injectable()
export class OAuthAccountService implements IOAuthAccountService {
    private readonly logger = new Logger(OAuthAccountService.name);

    constructor(
        @Inject(OAUTH_ACCOUNT_REPOSITORY)
        private readonly oauthAccountRepository: IOAuthAccountRepository
    ) {}

    public async createAccount(
        provider: string,
        oauthUser: CreateOAuthUserDto,
        user: UserDto
    ): Promise<void> {
        this.logger.log(
            `Creating OAuth account with email: ${oauthUser.email}`
        );

        const candidate: Optional<OAuthAccountDto> =
            await this.oauthAccountRepository.findAccount({
                provider: provider,
                providerId: oauthUser.providerId,
            });

        if (candidate) {
            throw new ValidationException('An account already exist');
        }

        await this.oauthAccountRepository.createAccount(
            provider,
            oauthUser,
            user
        );
        this.logger.log(
            `OAuth account created successfully: ${provider} id=${oauthUser.providerId}`
        );
    }

    public async getAccountByProvider(
        provider: string,
        providerId: string
    ): Promise<Optional<OAuthAccountDto>> {
        const oauthAccount: Optional<OAuthAccountDto> =
            await this.oauthAccountRepository.findAccount({
                provider: provider,
                providerId: providerId,
            });

        return oauthAccount;
    }
}
