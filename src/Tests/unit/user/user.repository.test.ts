import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { UserRepository } from '../../../Domain/User/repository/user.repository';
import {
    mockUser,
    mockUserEntity,
    mockUserWithPurchases,
    mockCreateUser,
    mockCreateOauthUser,
    mockFileName,
    mockOauthUser,
    mockOAuthUserEntity,
    MOCK_USER_EMAIL,
    MOCK_NONEXISTENT_USER_EMAIL,
    mockUserWithPurchasesEntity,
    MOCK_USER_ID,
    MOCK_NONEXISTENT_USER_ID,
    mockUpdateUser,
    MOCK_NEW_REFRESH_TOKEN,
} from './user.mock';

describe('UserRepository', () => {
    let userRepository: UserRepository;
    let mockUserDb;
    let mockMappers;

    beforeEach(() => {
        mock.reset();

        mockUserDb = {
            create: mock.fn(),
            findOne: mock.fn(),
            update: mock.fn(),
            destroy: mock.fn(),
        };

        mockMappers = {
            userEntityToUser: mock.fn(),
            userEntityToUserWithPurchases: mock.fn(),
        };

        userRepository = new UserRepository(mockUserDb, mockMappers);
    });

    describe('createUser', () => {
        it('should create user and return mapped entity', async () => {
            mockUserDb.create.mock.mockImplementationOnce(() =>
                Promise.resolve(mockUserEntity)
            );
            mockMappers.userEntityToUser.mock.mockImplementationOnce(
                () => mockUser
            );

            const result = await userRepository.createUser(
                mockCreateUser,
                mockFileName
            );

            assert.deepStrictEqual(
                mockUserDb.create.mock.calls[0].arguments[0],
                { ...mockCreateUser, image: mockFileName }
            );
            assert.strictEqual(result, mockUser);
        });
    });

    describe('createOauthUser', () => {
        it('should create oauth user and return mapped entity', async () => {
            mockUserDb.create.mock.mockImplementationOnce(() =>
                Promise.resolve(mockOAuthUserEntity)
            );
            mockMappers.userEntityToUser.mock.mockImplementationOnce(
                () => mockOauthUser
            );

            const result =
                await userRepository.createOauthUser(mockCreateOauthUser);

            assert.deepStrictEqual(
                mockUserDb.create.mock.calls[0].arguments[0],
                {
                    email: mockCreateOauthUser.email,
                    firstName: mockCreateOauthUser.firstName,
                    lastName: mockCreateOauthUser.lastName,
                    isOAuthUser: true,
                }
            );

            assert.strictEqual(result, mockOauthUser);
        });
    });

    describe('findUser', () => {
        it('should return mapped user', async () => {
            mockUserDb.findOne.mock.mockImplementationOnce(() =>
                Promise.resolve(mockUserEntity)
            );
            mockMappers.userEntityToUser.mock.mockImplementationOnce(
                () => mockUser
            );

            const result = await userRepository.findUser({
                email: MOCK_USER_EMAIL,
            });

            assert.deepStrictEqual(
                mockUserDb.findOne.mock.calls[0].arguments[0],
                { where: { email: MOCK_USER_EMAIL } }
            );
            assert.deepStrictEqual(result, mockUser);
        });

        it('should return null when user not found', async () => {
            mockUserDb.findOne.mock.mockImplementationOnce(() =>
                Promise.resolve(null)
            );

            const result = await userRepository.findUser({
                email: MOCK_NONEXISTENT_USER_EMAIL,
            });

            assert.strictEqual(result, null);
        });
    });

    describe('findUserWithPurchases', () => {
        it('should return user with purchases', async () => {
            mockUserDb.findOne.mock.mockImplementationOnce(() =>
                Promise.resolve(mockUserWithPurchasesEntity)
            );
            mockMappers.userEntityToUserWithPurchases.mock.mockImplementationOnce(
                () => mockUserWithPurchases
            );

            const result =
                await userRepository.findUserWithPurchases(MOCK_USER_ID);

            assert.deepStrictEqual(
                mockUserDb.findOne.mock.calls[0].arguments[0].where,
                { userId: MOCK_USER_ID }
            );
            assert.deepStrictEqual(result, mockUserWithPurchases);
        });

        it('should return null when user not found', async () => {
            mockUserDb.findOne.mock.mockImplementationOnce(() =>
                Promise.resolve(null)
            );

            const result = await userRepository.findUserWithPurchases(
                MOCK_NONEXISTENT_USER_ID
            );

            assert.strictEqual(result, null);
        });
    });

    describe('updateUser', () => {
        it('should update user', async () => {
            mockUserDb.update.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await userRepository.updateUser(MOCK_USER_ID, mockUpdateUser);

            assert.deepStrictEqual(mockUserDb.update.mock.calls[0].arguments, [
                mockUpdateUser,
                { where: { userId: MOCK_USER_ID } },
            ]);
        });
    });

    describe('updateRefreshToken', () => {
        it('should update refresh token with value (login)', async () => {
            mockUserDb.update.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await userRepository.updateRefreshToken(
                MOCK_USER_ID,
                MOCK_NEW_REFRESH_TOKEN
            );

            assert.deepStrictEqual(mockUserDb.update.mock.calls[0].arguments, [
                { refreshToken: MOCK_NEW_REFRESH_TOKEN },
                { where: { userId: MOCK_USER_ID } },
            ]);
        });

        it('should update refresh token with null (logout)', async () => {
            mockUserDb.update.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await userRepository.updateRefreshToken(MOCK_USER_ID, null);

            assert.deepStrictEqual(mockUserDb.update.mock.calls[0].arguments, [
                { refreshToken: null },
                { where: { userId: MOCK_USER_ID } },
            ]);
        });
    });

    describe('destroyUser', () => {
        it('should destroy user by id', async () => {
            mockUserDb.destroy.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await userRepository.destroyUser(MOCK_USER_ID);

            assert.deepStrictEqual(mockUserDb.destroy.mock.calls[0].arguments, [
                { where: { userId: MOCK_USER_ID } },
            ]);
        });
    });
});
