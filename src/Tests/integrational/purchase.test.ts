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
import { PURCHASE_REPOSITORY } from '../../Domain/Purchase/purchse.constants';
import {
    mockPurcahsePresentation,
    mockPurchase,
} from '../unit/purchase/purchase.mock';
import { MOCK_RECORD_ID } from '../unit/record/record.mock';
import { RECORD_SERVICE } from '../../Domain/Record/record.constants';

describe('Purchase', () => {
    let app: INestApplication;
    let mockPurchaseRepository;
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

        mockPurchaseRepository = {
            createPurchase: mock.fn(),
            updatePurchase: mock.fn(),
            findPurchase: mock.fn(),
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

        const mockModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(JwtGuard)
            .useClass(MockJwtGuard)
            .overrideGuard(PoliciesGuard)
            .useClass(MockPoliciesGuard)
            .overrideProvider(PURCHASE_REPOSITORY)
            .useValue(mockPurchaseRepository)
            .overrideProvider(RECORD_SERVICE)
            .useValue(mockRecordService)
            .compile();

        app = mockModule.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.useGlobalFilters(
            new GlobalExceptionFilter(),
            new AppExceptionFilter()
        );
        await app.init();
    });

    describe('GET /:id', () => {
        it('should tetrieve data about purchase', async () => {
            mockPurchaseRepository.findPurchase.mock.mockImplementation(() =>
                Promise.resolve(mockPurchase)
            );

            const response = await request(app.getHttpServer())
                .get(`/purchase/${MOCK_RECORD_ID}`)
                .expect(HttpStatus.OK);

            assert.deepStrictEqual(response.body, mockPurcahsePresentation);
        });
    });
});
