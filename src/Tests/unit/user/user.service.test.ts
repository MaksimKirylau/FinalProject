import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { UserService } from '../../../Domain/User/user.service';
import {
    MOCK_NEW_REFRESH_TOKEN,
    MOCK_NONEXISTENT_USER_EMAIL,
    MOCK_NONEXISTENT_USER_ID,
    MOCK_USER_EMAIL,
    MOCK_USER_ID,
    mockCreateOauthUser,
    mockCreateUser,
    mockFileName,
    mockImage,
    mockOauthUser,
    mockUpdateUser,
    mockUser,
    mockUserWithPurchases,
} from './user.mock';
import { UserDto } from '../../../Domain/User/user.dto';
import {
    ResourceNotFoundException,
    ValidationException,
} from '../../../Utility/errors/appExceptions/appException';

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepository;
    let mockFileService;

    beforeEach(() => {
        mock.reset();

        mockUserRepository = {
            findUser: mock.fn(),
            createUser: mock.fn(),
            updateUser: mock.fn(),
            destroyUser: mock.fn(),
            createOauthUser: mock.fn(),
            findUserWithPurchases: mock.fn(),
            updateRefreshToken: mock.fn(),
        };

        mockFileService = {
            createFile: mock.fn(),
        };

        userService = new UserService(mockUserRepository, mockFileService);
    });

    describe('createUser', () => {
        it('should create user successfully with image', async () => {
            mockUserRepository.findUser.mock.mockImplementationOnce(() =>
                Promise.resolve(null)
            );
            mockFileService.createFile.mock.mockImplementationOnce(() =>
                Promise.resolve(mockFileName)
            );
            mockUserRepository.createUser.mock.mockImplementationOnce(() =>
                Promise.resolve(mockUser)
            );

            const result: UserDto = await userService.createUser(
                mockCreateUser,
                mockImage
            );

            assert.deepStrictEqual(result.image, mockFileName);
            assert.deepStrictEqual(
                mockUserRepository.createUser.mock.calls[0].arguments,
                [mockCreateUser, mockFileName]
            );
        });

        it('should throw ResourceNotFoundException if user exists', async () => {
            mockUserRepository.findUser.mock.mockImplementationOnce(() =>
                Promise.resolve(mockUser)
            );

            await assert.rejects(
                () => userService.createUser(mockCreateUser, null),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(
                        error.message,
                        'A user with this email already exists.'
                    );
                    assert.strictEqual(error.details, mockUser.email);
                    return true;
                }
            );
        });
    });

    describe('createOauthUser', () => {
        it('should create OAuth user successfully', async () => {
            mockUserRepository.findUser.mock.mockImplementationOnce(() =>
                Promise.resolve(null)
            );
            mockUserRepository.createOauthUser.mock.mockImplementationOnce(() =>
                Promise.resolve(mockOauthUser)
            );

            const result =
                await userService.createOauthUser(mockCreateOauthUser);

            assert.strictEqual(result, mockOauthUser);
        });

        it('should throw BadRequestException for existing email', async () => {
            mockUserRepository.findUser.mock.mockImplementationOnce(() =>
                Promise.resolve(mockOauthUser)
            );

            await assert.rejects(
                () => userService.createOauthUser(mockCreateOauthUser),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(
                        error.message,
                        'A user with this email already exists.'
                    );
                    assert.strictEqual(
                        error.details,
                        mockCreateOauthUser.email
                    );
                    return true;
                }
            );
        });
    });

    describe('getUserById', () => {
        it('should return user when found', async () => {
            mockUserRepository.findUser.mock.mockImplementationOnce(() =>
                Promise.resolve(mockUser)
            );

            const result = await userService.getUserById(MOCK_USER_ID);

            assert.deepStrictEqual(result, mockUser);
        });

        it('should throw ResourceNotFoundException when user not found', async () => {
            mockUserRepository.findUser.mock.mockImplementationOnce(() =>
                Promise.resolve(null)
            );

            await assert.rejects(
                () => userService.getUserById(MOCK_NONEXISTENT_USER_ID),
                (error) => {
                    assert.ok(error instanceof ResourceNotFoundException);
                    assert.strictEqual(
                        error.message,
                        `user with identifier ${MOCK_NONEXISTENT_USER_ID} not found`
                    );
                    return true;
                }
            );
        });
    });

    describe('getUserByEmail', () => {
        it('should return user when exists', async () => {
            mockUserRepository.findUser.mock.mockImplementationOnce(() =>
                Promise.resolve(mockUser)
            );

            const result = await userService.getUserByEmail(MOCK_USER_EMAIL);

            assert.deepStrictEqual(result, mockUser);
        });

        it('should return null when user not found', async () => {
            mockUserRepository.findUser.mock.mockImplementationOnce(() =>
                Promise.resolve(null)
            );

            const result = await userService.getUserByEmail(
                MOCK_NONEXISTENT_USER_EMAIL
            );

            assert.strictEqual(result, null);
        });
    });

    describe('getUserByWithPurchases', () => {
        it('should return user with purchases', async () => {
            mockUserRepository.findUserWithPurchases.mock.mockImplementationOnce(
                () => Promise.resolve(mockUserWithPurchases)
            );

            const result =
                await userService.getUserByWithPurchases(MOCK_USER_ID);

            assert.deepStrictEqual(result, mockUserWithPurchases);
        });

        it('should throw ResourceNotFoundException when user not found', async () => {
            mockUserRepository.findUserWithPurchases.mock.mockImplementationOnce(
                () => Promise.resolve(null)
            );

            await assert.rejects(
                () =>
                    userService.getUserByWithPurchases(
                        MOCK_NONEXISTENT_USER_ID
                    ),
                (error) => {
                    assert.ok(error instanceof ResourceNotFoundException);
                    assert.strictEqual(
                        error.message,
                        `user with identifier ${MOCK_NONEXISTENT_USER_ID} not found`
                    );
                    return true;
                }
            );
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            mockUserRepository.updateUser.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await userService.updateUser(MOCK_USER_ID, mockUpdateUser);

            assert.deepStrictEqual(
                mockUserRepository.updateUser.mock.calls[0].arguments,
                [MOCK_USER_ID, mockUpdateUser]
            );
        });

        it('should throw ValidationException for empty DTO', async () => {
            await assert.rejects(
                () => userService.updateUser(MOCK_USER_ID, {}),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(
                        error.message,
                        'No updates to implement'
                    );
                    return true;
                }
            );
        });
    });

    describe('deleteUser', () => {
        it('should call repository destroy method', async () => {
            mockUserRepository.destroyUser.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await userService.deleteUser(MOCK_USER_ID);

            assert.deepStrictEqual(
                mockUserRepository.destroyUser.mock.calls[0].arguments,
                [MOCK_USER_ID]
            );
        });
    });

    describe('updateRefreshToken', () => {
        it('should call repository update method (login)', async () => {
            mockUserRepository.updateRefreshToken.mock.mockImplementationOnce(
                () => Promise.resolve()
            );

            await userService.updateRefreshToken(
                MOCK_USER_ID,
                MOCK_NEW_REFRESH_TOKEN
            );

            assert.deepStrictEqual(
                mockUserRepository.updateRefreshToken.mock.calls[0].arguments,
                [MOCK_USER_ID, MOCK_NEW_REFRESH_TOKEN]
            );
        });

        it('should call repository update method with null token (logout)', async () => {
            mockUserRepository.updateRefreshToken.mock.mockImplementationOnce(
                () => Promise.resolve()
            );

            await userService.updateRefreshToken(MOCK_USER_ID, null);

            assert.deepStrictEqual(
                mockUserRepository.updateRefreshToken.mock.calls[0].arguments,
                [MOCK_USER_ID, null]
            );
        });
    });
});
