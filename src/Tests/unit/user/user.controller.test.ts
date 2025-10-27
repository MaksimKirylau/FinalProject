import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import {
    mockUser,
    mockUserWithPurchases,
    mockUpdateUser,
    mockUserPresentation,
    mockRequestUser,
    mockUserWithPurchasesPresentation,
} from './user.mock';
import { UserController } from '../../../API/User/user.controller';

describe('UserController', () => {
    let userController: UserController;
    let mockUserService;
    let mockUserApiMapper;

    beforeEach(() => {
        mock.reset();

        mockUserService = {
            createUser: mock.fn(),
            createOauthUser: mock.fn(),
            getUserById: mock.fn(),
            getUserByEmail: mock.fn(),
            getUserByWithPurchases: mock.fn(),
            updateUser: mock.fn(),
            deleteUser: mock.fn(),
            updateRefreshToken: mock.fn(),
        };

        mockUserApiMapper = {
            userToPresentation: mock.fn(),
            userWithPurchasesToPresentation: mock.fn(),
        };

        userController = new UserController(mockUserService, mockUserApiMapper);
    });

    describe('getUser', () => {
        it('should return user presentation when user found', async () => {
            mockUserService.getUserById.mock.mockImplementationOnce(() =>
                Promise.resolve(mockUser)
            );
            mockUserApiMapper.userToPresentation.mock.mockImplementationOnce(
                () => mockUserPresentation
            );

            const result = await userController.getUser(mockRequestUser);

            assert.deepStrictEqual(
                mockUserService.getUserById.mock.calls[0].arguments,
                [mockRequestUser.userId]
            );
            assert.deepStrictEqual(
                mockUserApiMapper.userToPresentation.mock.calls[0].arguments,
                [mockUser]
            );
            assert.deepStrictEqual(result, mockUserPresentation);
        });
    });

    describe('getUserWithPurchases', () => {
        it('should return user with purchases presentation', async () => {
            mockUserService.getUserByWithPurchases.mock.mockImplementationOnce(
                () => Promise.resolve(mockUserWithPurchases)
            );
            mockUserApiMapper.userWithPurchasesToPresentation.mock.mockImplementationOnce(
                () => mockUserWithPurchasesPresentation
            );

            const result =
                await userController.getUserWithPurchases(mockRequestUser);

            assert.deepStrictEqual(result, mockUserWithPurchasesPresentation);
            assert.deepStrictEqual(
                mockUserService.getUserByWithPurchases.mock.calls[0].arguments,
                [mockRequestUser.userId]
            );
            assert.deepStrictEqual(
                mockUserApiMapper.userWithPurchasesToPresentation.mock.calls[0]
                    .arguments,
                [mockUserWithPurchases]
            );
        });
    });

    describe('updateUser', () => {
        it('should call service to update user', async () => {
            mockUserService.updateUser.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await userController.updateUser(mockRequestUser, mockUpdateUser);

            assert.deepStrictEqual(
                mockUserService.updateUser.mock.calls[0].arguments,
                [mockRequestUser.userId, mockUpdateUser]
            );
        });
    });

    describe('deleteUser', () => {
        it('should call service to delete user', async () => {
            mockUserService.deleteUser.mock.mockImplementationOnce(() =>
                Promise.resolve()
            );

            await userController.deleteUser(mockRequestUser);

            assert.deepStrictEqual(
                mockUserService.deleteUser.mock.calls[0].arguments,
                [mockRequestUser.userId]
            );
        });
    });
});
