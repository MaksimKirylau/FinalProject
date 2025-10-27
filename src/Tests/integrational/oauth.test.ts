import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { AppModule } from '../../app.module';
import request from 'supertest';
import { GlobalExceptionFilter } from '../../Utility/errors/globalException.filter';
import { AppExceptionFilter } from '../../Utility/errors/appExceptions/appException.filter';
import { mockCreateOauthUser, mockUser } from '../unit/user/user.mock';
import { USER_SERVICE } from '../../Domain/User/user.constants';
import { MOCK_OAUTH_CODE, MOCK_OAUTH_URL, mockToken } from './auth.mock';
import { AUTH_SERVICE } from '../../Auth/authentification/auth.constants';
import { OAUTH_ACCOUNT_SERVICE } from '../../Domain/OAuthAccount/oauthAccount.constants';
import { OAuthProviderFactory } from '../../Auth/authentification/oauth/providers/oauth.provider.factory';

describe('Auth', () => {
    let app: INestApplication;
    let mockUserService;
    let mockAuthSerrvice;
    let mockOauthAccountService;

    beforeEach(async () => {
        mock.reset();

        mockUserService = {
            createOauthUser: mock.fn(),
            getUserByEmail: mock.fn(),
        };

        mockAuthSerrvice = {
            login: mock.fn(),
        };

        mockOauthAccountService = {
            getAccountByProvider: mock.fn(),
            createAccount: mock.fn(),
        };

        class MockProvider {
            authorize() {
                return MOCK_OAUTH_URL;
            }

            callback() {
                return mockCreateOauthUser;
            }
        }

        class MockOAuthProviderFactory {
            getProvider() {
                return new MockProvider();
            }
        }

        const mockModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(USER_SERVICE)
            .useValue(mockUserService)
            .overrideProvider(AUTH_SERVICE)
            .useValue(mockAuthSerrvice)
            .overrideProvider(OAUTH_ACCOUNT_SERVICE)
            .useValue(mockOauthAccountService)
            .overrideProvider(USER_SERVICE)
            .useValue(mockUserService)
            .overrideProvider(OAuthProviderFactory)
            .useClass(MockOAuthProviderFactory)
            .compile();

        app = mockModule.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.useGlobalFilters(
            new GlobalExceptionFilter(),
            new AppExceptionFilter()
        );
        await app.init();
    });

    describe('GET /oauth/:provider', () => {
        it('get oauth login link and retrieve token', async () => {
            const response = await request(app.getHttpServer())
                .get('/oauth/google')
                .expect(HttpStatus.OK);

            assert.deepStrictEqual(response.body, {
                authorizationUrl: MOCK_OAUTH_URL,
            });
        });
    });

    describe('POST /oauth/:provider', () => {
        it('login and retrieve token', async () => {
            mockOauthAccountService.getAccountByProvider.mock.mockImplementation(
                () => Promise.resolve(null)
            );
            mockUserService.getUserByEmail.mock.mockImplementation(() =>
                Promise.resolve(null)
            );
            mockUserService.createOauthUser.mock.mockImplementation(() =>
                Promise.resolve(mockUser)
            );
            mockOauthAccountService.createAccount.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            mockAuthSerrvice.login.mock.mockImplementation(() =>
                Promise.resolve(mockToken)
            );

            const response = await request(app.getHttpServer())
                .get(`/oauth/google/callback?code=${MOCK_OAUTH_CODE}`)
                .expect(HttpStatus.OK);

            assert.deepStrictEqual(response.body, mockToken);
        });
    });
});
