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
import { mockRequestUser } from '../unit/user/user.mock';
import { JwtGuard } from '../../Auth/authentification/guards/jwt.guard';
import { SEQUELIZE } from '../../Database/database.constants';
import { Sequelize } from 'sequelize-typescript';
import { RECORD_REPOSITORY } from '../../Domain/Record/record.constants';
import {
    MOCK_RECORD_ID,
    mockCreateDiscogsRecord,
    mockCreateRecord,
    mockDiscogsRecord,
    mockDiscogsRelease,
    mockRecord,
    mockRecordPresentation,
    mockRecords,
    mockRecordsList,
    mockRecordsListPresentation,
    mockRecordsPresentation,
    mockUpdateRecord,
} from '../unit/record/record.mock';
import { DISCOGS_SERVICE } from '../../Utility/services/Discogs/discogs.constants';

describe('Record', () => {
    let app: INestApplication;
    let mockRecordRepository;
    let mockDiscogsService;

    class MockJwtGuard implements CanActivate {
        canActivate(context: ExecutionContext): boolean {
            const req = context.switchToHttp().getRequest();
            req.user = { mockRequestUser };
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

        mockRecordRepository = {
            findRecord: mock.fn(),
            findRecords: mock.fn(),
            findRecordsList: mock.fn(),
            createRecord: mock.fn(),
            updateRecord: mock.fn(),
            destroyRecord: mock.fn(),
        };

        mockDiscogsService = {
            getReleaseDetails: mock.fn(),
            getReleaseScore: mock.fn(),
        };

        const mockModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(JwtGuard)
            .useClass(MockJwtGuard)
            .overrideGuard(PoliciesGuard)
            .useClass(MockPoliciesGuard)
            .overrideProvider(SEQUELIZE)
            .useValue({} as Sequelize)
            .overrideProvider(RECORD_REPOSITORY)
            .useValue(mockRecordRepository)
            .overrideProvider(DISCOGS_SERVICE)
            .useValue(mockDiscogsService)
            .compile();

        app = mockModule.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.useGlobalFilters(
            new GlobalExceptionFilter(),
            new AppExceptionFilter()
        );
        await app.init();
    });

    describe('GET /record/search', () => {
        it('should get records data', async () => {
            mockRecordRepository.findRecords.mock.mockImplementation(() =>
                Promise.resolve(mockRecords)
            );

            const response = await request(app.getHttpServer())
                .get('/record/search')
                .expect(HttpStatus.OK);

            assert.deepStrictEqual(response.body, mockRecordsPresentation);
        });
    });

    describe('GET /record/list', () => {
        it('should records data with first review', async () => {
            mockRecordRepository.findRecordsList.mock.mockImplementation(() =>
                Promise.resolve(mockRecordsList)
            );

            const response = await request(app.getHttpServer())
                .get('/record/list')
                .expect(HttpStatus.OK);

            assert.deepStrictEqual(response.body, mockRecordsListPresentation);
        });
    });

    describe('POST /record/add', () => {
        it('should create new record', async () => {
            mockRecordRepository.createRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );

            const response = await request(app.getHttpServer())
                .post('/record/add')
                .send(mockCreateRecord)
                .expect(HttpStatus.CREATED);

            assert.deepStrictEqual(response.body, mockRecordPresentation);
        });
    });

    describe('POST /record/add', () => {
        it('should create new discogs record', async () => {
            mockRecordRepository.createRecord.mock.mockImplementation(() =>
                Promise.resolve(mockDiscogsRecord)
            );
            mockDiscogsService.getReleaseDetails.mock.mockImplementation(() =>
                Promise.resolve(mockDiscogsRelease)
            );

            const response = await request(app.getHttpServer())
                .post('/record/discogs/add')
                .send(mockCreateDiscogsRecord)
                .expect(HttpStatus.CREATED);

            assert.deepStrictEqual(response.body, mockRecordPresentation);
        });
    });

    describe('PUT /record/update/', () => {
        it('should update record', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );
            mockRecordRepository.updateRecord.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            await request(app.getHttpServer())
                .put(`/record/update/${MOCK_RECORD_ID}`)
                .send(mockUpdateRecord)
                .expect(HttpStatus.OK);
        });
    });

    describe('DELETE /record/delete/', () => {
        it('should delete record', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );
            mockRecordRepository.destroyRecord.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            await request(app.getHttpServer())
                .delete(`/record/delete/${6}`)
                .expect(HttpStatus.OK);
        });
    });
});
