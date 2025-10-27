import { OAuthAccountDto } from '../../../Domain/OAuthAccount/oauthAccount.dto';
import { OAuthAccountEntity } from '../../../Domain/OAuthAccount/repository/oauthAccount.repository.model';

export const MOCK_PROVIDER: string = 'google';
export const MOCK_PROVIDER_ID: string = 'providerId_1';
export const MOCK_NONEXISTENT_ID: string = 'providerId_999';

export const mockOauthAccountEntity: OAuthAccountEntity = {
    dataValues: {
        oauthId: 1,
        userId: 1,
        email: 'mail@gmail.com',
        provider: 'google',
        providerId: 'providerId_1',
    },
} as OAuthAccountEntity;

export const mockOauthAccount: OAuthAccountDto = {
    oauthId: 1,
    userId: 1,
    email: 'mail@gmail.com',
    provider: 'google',
    providerId: 'providerId_1',
} as OAuthAccountEntity;
