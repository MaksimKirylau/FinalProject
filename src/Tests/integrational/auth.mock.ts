import {
    LoginDto,
    RefreshTokenDto,
    TokenDto,
} from '../../Auth/authentification/auth.dto';

export const MOCK_ACCESS_TOKEN: string = 'accessToken';
export const MOCK_REFRESH_TOKEN: string = 'refreshToken';
export const MOCK_HASHED_PASSWORD: string = 'hashedPassword';
export const MOCK_OAUTH_URL: string = 'https://oauth-provider-url.com';
export const MOCK_OAUTH_CODE: string = 'oauthCode';

export const mockToken: TokenDto = {
    accessToken: MOCK_ACCESS_TOKEN,
    refreshToken: MOCK_REFRESH_TOKEN,
};

export const mockRefreshToken: RefreshTokenDto = {
    refreshToken: MOCK_REFRESH_TOKEN,
};

export const mockLogin: LoginDto = {
    email: 'mail@mail.ru',
    password: 'plainPassword',
};
