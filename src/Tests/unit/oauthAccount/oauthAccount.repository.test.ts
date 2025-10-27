import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import {
    MOCK_PROVIDER,
    mockOauthAccount,
    mockOauthAccountEntity,
} from './oauthAccount.mock';
import {
    MOCK_NONEXISTENT_USER_ID,
    MOCK_USER_ID,
    mockCreateOauthUser,
    mockUser,
} from '../user/user.mock';
import { OAuthAccountRepository } from '../../../Domain/OAuthAccount/repository/oauthAccount.repository';

describe('OAuthAccountRepository', () => {
    let oauthAccountRepository: OAuthAccountRepository;
    let mockOauthAccountDb;
    let mockOAuthAccountMappers;

    beforeEach(() => {
        mock.reset();

        mockOauthAccountDb = {
            create: mock.fn(),
            findOne: mock.fn(),
        };

        mockOAuthAccountMappers = {
            oauthAccountEntityToAccount: mock.fn(),
        };

        oauthAccountRepository = new OAuthAccountRepository(
            mockOauthAccountDb,
            mockOAuthAccountMappers
        );
    });

    describe('createAccount', () => {
        it('should create account successfully', async () => {
            mockOauthAccountDb.create.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await oauthAccountRepository.createAccount(
                MOCK_PROVIDER,
                mockCreateOauthUser,
                mockUser
            );

            assert.deepStrictEqual(
                mockOauthAccountDb.create.mock.calls[0].arguments,
                [
                    {
                        userId: mockUser.userId,
                        email: mockUser.email,
                        provider: MOCK_PROVIDER,
                        providerId: mockCreateOauthUser.providerId,
                    },
                ]
            );
        });
    });

    describe('findAccount', () => {
        it('should return OAuthAccountDto when account is found', async () => {
            mockOauthAccountDb.findOne.mock.mockImplementationOnce(() =>
                Promise.resolve(mockOauthAccountEntity)
            );
            mockOAuthAccountMappers.oauthAccountEntityToAccount.mock.mockImplementationOnce(
                () => mockOauthAccount
            );

            const result = await oauthAccountRepository.findAccount({
                userId: MOCK_USER_ID,
            });

            assert.deepStrictEqual(
                mockOauthAccountDb.findOne.mock.calls[0].arguments,
                [{ where: { userId: MOCK_USER_ID } }]
            );
            assert.deepStrictEqual(
                mockOAuthAccountMappers.oauthAccountEntityToAccount.mock
                    .calls[0].arguments,
                [mockOauthAccountEntity]
            );
            assert.deepStrictEqual(result, mockOauthAccount);
        });

        it('should return null when account is not found', async () => {
            mockOauthAccountDb.findOne.mock.mockImplementationOnce(() =>
                Promise.resolve(null)
            );

            const result = await oauthAccountRepository.findAccount({
                userId: MOCK_NONEXISTENT_USER_ID,
            });

            assert.deepStrictEqual(
                mockOauthAccountDb.findOne.mock.calls[0].arguments[0],
                { where: { userId: MOCK_NONEXISTENT_USER_ID } }
            );
            assert.deepStrictEqual(result, null);
        });
    });
});
