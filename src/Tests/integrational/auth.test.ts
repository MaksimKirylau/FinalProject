import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { AppModule } from '../../app.module';
import request from 'supertest';
import { GlobalExceptionFilter } from '../../Utility/errors/globalException.filter';
import { AppExceptionFilter } from '../../Utility/errors/appExceptions/appException.filter';
import {
    mockCreateUser,
    mockImage,
    mockRequestUser,
    mockUser,
} from '../unit/user/user.mock';
import { USER_SERVICE } from '../../Domain/User/user.constants';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import {
    MOCK_ACCESS_TOKEN,
    MOCK_HASHED_PASSWORD,
    MOCK_REFRESH_TOKEN,
    mockLogin,
    mockRefreshToken,
    mockToken,
} from './auth.mock';
import bcrypt from 'bcrypt';

describe('Auth', () => {
    let app: INestApplication;
    let mockUserService;
    let mockJwtService;

    class MockJwtGuard implements CanActivate {
        canActivate(context: ExecutionContext): boolean {
            const req = context.switchToHttp().getRequest();
            req.user = mockRequestUser;
            return true;
        }
    }

    beforeEach(async () => {
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

        mockJwtService = {
            sign: mock.fn(),
        };

        const mockModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue(new MockJwtGuard())
            .overrideGuard(AuthGuard('local'))
            .useValue(new MockJwtGuard())
            .overrideProvider(JwtService)
            .useValue(mockJwtService)
            .overrideProvider(USER_SERVICE)
            .useValue(mockUserService)
            .compile();

        app = mockModule.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.useGlobalFilters(
            new GlobalExceptionFilter(),
            new AppExceptionFilter()
        );
        await app.init();
    });

    describe('POST /auth/login', () => {
        it('login and retrieve token', async () => {
            mockJwtService.sign.mock.mockImplementationOnce(
                () => MOCK_ACCESS_TOKEN,
                0
            );
            mockJwtService.sign.mock.mockImplementationOnce(
                () => MOCK_REFRESH_TOKEN,
                1
            );
            mockUserService.updateRefreshToken.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .expect(HttpStatus.CREATED)
                .send(mockLogin);

            assert.deepStrictEqual(response.body, mockToken);
        });
    });

    describe('DELETE /auth/logout', () => {
        it('logout and delete refresh token', async () => {
            mockUserService.updateRefreshToken.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            await request(app.getHttpServer())
                .delete('/auth/logout')
                .expect(HttpStatus.OK);
        });
    });

    describe('POST /auth/register/', () => {
        it('register a new user', async (t) => {
            mockUserService.getUserByEmail.mock.mockImplementation(() =>
                Promise.resolve(null)
            );
            t.mock.method(bcrypt, 'hash', () =>
                Promise.resolve(MOCK_HASHED_PASSWORD)
            );
            mockUserService.createUser.mock.mockImplementation(() =>
                Promise.resolve(mockUser)
            );

            mockJwtService.sign.mock.mockImplementationOnce(
                () => MOCK_ACCESS_TOKEN,
                0
            );
            mockJwtService.sign.mock.mockImplementationOnce(
                () => MOCK_REFRESH_TOKEN,
                1
            );
            mockUserService.updateRefreshToken.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            const response = await request(app.getHttpServer())
                .post('/auth/register/')
                .send(mockCreateUser)
                .send(mockImage)
                .expect(HttpStatus.CREATED);

            assert.deepStrictEqual(response.body, mockToken);
        });
    });

    describe('POST /auth/refresh/', () => {
        it('should update tokens', async (t) => {
            t.mock.method(bcrypt, 'compareSync', () => true);
            mockUserService.getUserById.mock.mockImplementation(() =>
                Promise.resolve(mockUser)
            );

            mockJwtService.sign.mock.mockImplementationOnce(
                () => MOCK_ACCESS_TOKEN,
                0
            );
            mockJwtService.sign.mock.mockImplementationOnce(
                () => MOCK_REFRESH_TOKEN,
                1
            );
            mockUserService.updateRefreshToken.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            const response = await request(app.getHttpServer())
                .delete('/auth/refresh/')
                .send(mockRefreshToken)
                .expect(HttpStatus.OK);

            assert.deepStrictEqual(response.body, mockToken);
        });
    });
});
