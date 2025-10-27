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
import {
    MOCK_RECORD_ID,
    mockDiscogsRecord,
    mockRecord,
} from '../unit/record/record.mock';
import { REVIEW_REPOSITORY } from '../../Domain/Review/review.constants';
import {
    MOCK_REVIEW_ID,
    mockCreateReview,
    mockDiscogsScore,
    mockReview,
    mockReviewPresentation,
    mockReviews,
    mockReviewsPresentation,
} from '../unit/review/review.mock';
import { DISCOGS_SERVICE } from '../../Utility/services/Discogs/discogs.constants';
import { RECORD_SERVICE } from '../../Domain/Record/record.constants';

describe('Review', () => {
    let app: INestApplication;
    let mockReviewRepository;
    let mockDiscogsService;
    let mockRecordService;

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

        mockReviewRepository = {
            findReview: mock.fn(),
            createReview: mock.fn(),
            findReviews: mock.fn(),
            destroyReview: mock.fn(),
        };

        mockRecordService = {
            getRecord: mock.fn(),
            getRecords: mock.fn(),
            getRecordsList: mock.fn(),
            createRecord: mock.fn(),
            createDiscogsRecord: mock.fn(),
            updateRecord: mock.fn(),
            deleteRecord: mock.fn(),
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
            .overrideProvider(REVIEW_REPOSITORY)
            .useValue(mockReviewRepository)
            .overrideProvider(RECORD_SERVICE)
            .useValue(mockRecordService)
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

    describe('GET /review/', () => {
        it('should get reviews for record with passed id', async () => {
            mockReviewRepository.findReviews.mock.mockImplementation(() =>
                Promise.resolve(mockReviews)
            );

            const response = await request(app.getHttpServer())
                .get(`/review/${MOCK_RECORD_ID}`)
                .expect(HttpStatus.OK);

            assert.deepStrictEqual(response.body, mockReviewsPresentation);
        });
    });

    describe('GET /discogs/score/', () => {
        it('should get discogs score for record with passed id', async () => {
            mockRecordService.getRecord.mock.mockImplementation(() =>
                Promise.resolve(mockDiscogsRecord)
            );
            mockDiscogsService.getReleaseScore.mock.mockImplementation(() =>
                Promise.resolve(mockDiscogsScore)
            );

            const response = await request(app.getHttpServer())
                .get(`/review/discogs/score/${MOCK_RECORD_ID}`)
                .expect(HttpStatus.OK);

            assert.deepStrictEqual(response.body, mockDiscogsScore);
        });
    });

    describe('POST /review/', () => {
        it('should create review for record with passed id', async () => {
            mockRecordService.getRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );
            mockReviewRepository.findReview.mock.mockImplementation(() =>
                Promise.resolve(null)
            );
            mockReviewRepository.createReview.mock.mockImplementation(() =>
                Promise.resolve(mockReview)
            );

            const response = await request(app.getHttpServer())
                .post(`/review/${MOCK_RECORD_ID}`)
                .send(mockCreateReview)
                .expect(HttpStatus.CREATED);

            assert.deepStrictEqual(response.body, mockReviewPresentation);
        });
    });

    describe('DELETE /review/', () => {
        it('should delete review', async () => {
            mockReviewRepository.findReview.mock.mockImplementation(() =>
                Promise.resolve(mockReview)
            );
            mockReviewRepository.destroyReview.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            await request(app.getHttpServer())
                .delete(`/review/${MOCK_REVIEW_ID}`)
                .expect(HttpStatus.OK);
        });
    });
});
