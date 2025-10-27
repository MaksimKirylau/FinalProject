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
import { PoliciesGuard } from '../../Auth/authorization/guards/casl.guard';
import {
    mockFileName,
    mockRequestUser,
    mockUpdateUser,
    mockUser,
    mockUserPresentation,
    mockUserWithPurchases,
    mockUserWithPurchasesPresentation,
} from '../unit/user/user.mock';
import { JwtGuard } from '../../Auth/authentification/guards/jwt.guard';
import { USER_REPOSITORY } from '../../Domain/User/user.constants';
import { FILE_SERVICE } from '../../Utility/services/File/file.constants';

describe('User', () => {
    let app: INestApplication;
    let mockUserRepository;
    let fileService;

    class MockJwtGuard implements CanActivate {
        canActivate(context: ExecutionContext): boolean {
            const req = context.switchToHttp().getRequest();
            req.user = mockRequestUser;
            return true;
        }
    }

    class MockPoliciesGuard implements CanActivate {
        canActivate(_context: ExecutionContext): boolean {
            return true;
        }
    }

    beforeEach(async () => {
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

        fileService = {
            createFile: mock.fn(),
        };

        const mockModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(JwtGuard)
            .useClass(MockJwtGuard)
            .overrideGuard(PoliciesGuard)
            .useClass(MockPoliciesGuard)
            .overrideProvider(USER_REPOSITORY)
            .useValue(mockUserRepository)
            .overrideGuard(FILE_SERVICE)
            .useValue(fileService)
            .compile();

        app = mockModule.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.useGlobalFilters(
            new GlobalExceptionFilter(),
            new AppExceptionFilter()
        );
        await app.init();
    });

    describe('GET /user/me', () => {
        it('should get user data', async () => {
            mockUserRepository.findUser.mock.mockImplementation(() =>
                Promise.resolve(mockUser)
            );

            const response = await request(app.getHttpServer())
                .get('/user/me')
                .expect(HttpStatus.OK);

            assert.deepStrictEqual(response.body, mockUserPresentation);
        });
    });

    describe('GET /user/info', () => {
        it('should get user data with purchases', async () => {
            mockUserRepository.findUserWithPurchases.mock.mockImplementation(
                () => Promise.resolve(mockUserWithPurchases)
            );
            fileService.createFile.mock.mockImplementation(() =>
                Promise.resolve(mockFileName)
            );

            const response = await request(app.getHttpServer())
                .get('/user/info')
                .expect(HttpStatus.OK);

            assert.deepStrictEqual(
                response.body,
                mockUserWithPurchasesPresentation
            );
        });
    });

    describe('GET /user/update/', () => {
        it('should get user data with purchases', async () => {
            mockUserRepository.updateUser.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            await request(app.getHttpServer())
                .put('/user/update/')
                .send(mockUpdateUser)
                .expect(HttpStatus.OK);
        });
    });

    describe('GET /user/delete/', () => {
        it('should get user data with purchases', async () => {
            mockUserRepository.destroyUser.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            await request(app.getHttpServer())
                .delete('/user/delete/')
                .expect(HttpStatus.OK);
        });
    });
});
