import { Optional } from '../../Utility/global.types';
import { OAuthAccountDto } from './oauthAccount.dto';
import { CreateOAuthUserDto } from '../../Auth/authentification/oauth/oauth.dto';
import { UserDto } from '../User/user.dto';
import { OAuthAccountEntity } from './repository/oauthAccount.repository.model';

export interface IOAuthAccountService {
    createAccount(
        provider: string,
        oauthUser: CreateOAuthUserDto,
        user: UserDto
    ): Promise<void>;
    getAccountByProvider(
        provider: string,
        providerId: string
    ): Promise<Optional<OAuthAccountDto>>;
}

export interface IOAuthAccountRepository {
    createAccount(
        provider: string,
        oauthUser: CreateOAuthUserDto,
        user: UserDto
    ): Promise<void>;
    findAccount(
        options: Partial<OAuthAccountDto>
    ): Promise<Optional<OAuthAccountDto>>;
}

export interface IOAuthAccountMappers {
    oauthAccountEntityToAccount(dto: OAuthAccountEntity): OAuthAccountDto;
}
