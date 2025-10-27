import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { OAuthAccountService } from '../../../Domain/OAuthAccount/oauthAccount.service';
import {
    MOCK_NONEXISTENT_ID,
    MOCK_PROVIDER,
    MOCK_PROVIDER_ID,
} from './oauthAccount.mock';
import {
    mockCreateOauthUser,
    mockOauthUser,
    mockUser,
} from '../user/user.mock';
import { ValidationException } from '../../../Utility/errors/appExceptions/appException';

describe('OAuthAccountService', () => {
    let oauthAccountService: OAuthAccountService;
    let mockOAuthAccountRepository;

    beforeEach(() => {
        mock.reset();

        mockOAuthAccountRepository = {
            findAccount: mock.fn(),
            createAccount: mock.fn(),
        };

        oauthAccountService = new OAuthAccountService(
            mockOAuthAccountRepository
        );
    });

    describe('createAccount', () => {
        it('should create account successfully when account does not exist', async () => {
            mockOAuthAccountRepository.findAccount.mock.mockImplementationOnce(
                () => Promise.resolve(null)
            );
            mockOAuthAccountRepository.createAccount.mock.mockImplementationOnce(
                () => Promise.resolve()
            );

            await oauthAccountService.createAccount(
                MOCK_PROVIDER,
                mockCreateOauthUser,
                mockUser
            );

            assert.deepStrictEqual(
                mockOAuthAccountRepository.findAccount.mock.calls[0]
                    .arguments[0],
                {
                    provider: MOCK_PROVIDER,
                    providerId: mockCreateOauthUser.providerId,
                }
            );
            assert.deepStrictEqual(
                mockOAuthAccountRepository.createAccount.mock.calls[0]
                    .arguments,
                [MOCK_PROVIDER, mockCreateOauthUser, mockUser]
            );
        });

        it('should throw ValidationException when account already exists', async () => {
            mockOAuthAccountRepository.findAccount.mock.mockImplementationOnce(
                () => Promise.resolve(mockOauthUser)
            );

            await assert.rejects(
                () =>
                    oauthAccountService.createAccount(
                        MOCK_PROVIDER,
                        mockCreateOauthUser,
                        mockUser
                    ),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(
                        error.message,
                        'An account already exist'
                    );
                    return true;
                }
            );
        });
    });

    describe('getAccountByProvider', () => {
        it('should return account when found', async () => {
            mockOAuthAccountRepository.findAccount.mock.mockImplementationOnce(
                () => Promise.resolve(mockOauthUser)
            );

            const result = await oauthAccountService.getAccountByProvider(
                MOCK_PROVIDER,
                MOCK_PROVIDER_ID
            );

            assert.deepStrictEqual(result, mockOauthUser);
            assert.deepStrictEqual(
                mockOAuthAccountRepository.findAccount.mock.calls[0].arguments,
                [{ provider: MOCK_PROVIDER, providerId: MOCK_PROVIDER_ID }]
            );
        });

        it('should return null when account not found', async () => {
            mockOAuthAccountRepository.findAccount.mock.mockImplementationOnce(
                () => Promise.resolve(null)
            );

            const result = await oauthAccountService.getAccountByProvider(
                MOCK_PROVIDER,
                MOCK_NONEXISTENT_ID
            );

            assert.deepStrictEqual(
                mockOAuthAccountRepository.findAccount.mock.calls[0].arguments,
                [{ provider: MOCK_PROVIDER, providerId: MOCK_NONEXISTENT_ID }]
            );
            assert.strictEqual(result, null);
        });
    });
});
