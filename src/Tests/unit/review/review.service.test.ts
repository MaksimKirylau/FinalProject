import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { ReviewService } from '../../../Domain/Review/review.service';
import {
    MOCK_NONEXISTENT_REVIEW_ID,
    MOCK_REVIEW_ID,
    mockCreateReview,
    mockDiscogsScore,
    mockReview,
    mockReviewPagination,
    mockReviews,
} from './review.mock';
import { MOCK_USER_ID } from '../user/user.mock';
import {
    MOCK_NONEXISTENT_RECORD_ID,
    MOCK_RECORD_ID,
    mockDiscogsRecord,
    mockRecord,
} from '../record/record.mock';
import {
    ResourceNotFoundException,
    ValidationException,
} from '../../../Utility/errors/appExceptions/appException';

describe('ReviewService', () => {
    let reviewService: ReviewService;
    let mockReviewRepository;
    let mockRecordService;
    let mockDiscogsService;

    beforeEach(() => {
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

        reviewService = new ReviewService(
            mockReviewRepository,
            mockRecordService,
            mockDiscogsService
        );
    });

    describe('createReview', () => {
        it('should create review', async () => {
            mockRecordService.getRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );
            mockReviewRepository.findReview.mock.mockImplementation(() =>
                Promise.resolve(null)
            );
            mockReviewRepository.createReview.mock.mockImplementation(() =>
                Promise.resolve(mockReview)
            );

            const result = await reviewService.createReview(
                MOCK_USER_ID,
                MOCK_RECORD_ID,
                mockCreateReview
            );

            assert.deepEqual(
                mockReviewRepository.findReview.mock.calls[0].arguments,
                [{ userId: MOCK_USER_ID, recordId: MOCK_RECORD_ID }]
            );
            assert.deepEqual(
                mockReviewRepository.createReview.mock.calls[0].arguments,
                [MOCK_USER_ID, MOCK_RECORD_ID, mockCreateReview]
            );
            assert.deepEqual(result, mockReview);
        });

        it('should throw ValidationException when user already reviewed record', async () => {
            mockRecordService.getRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );
            mockReviewRepository.findReview.mock.mockImplementation(() =>
                Promise.resolve(mockReview)
            );

            await assert.rejects(
                () =>
                    reviewService.createReview(
                        MOCK_USER_ID,
                        MOCK_RECORD_ID,
                        mockCreateReview
                    ),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(
                        error.message,
                        'You already got review for that record'
                    );
                    assert.strictEqual(error.details, MOCK_RECORD_ID);
                    return true;
                }
            );
        });
    });

    describe('getReviews', () => {
        it('should return reviews for record when found', async () => {
            mockReviewRepository.findReviews.mock.mockImplementation(() =>
                Promise.resolve(mockReviews)
            );

            const result = await reviewService.getReviews(
                MOCK_RECORD_ID,
                mockReviewPagination
            );

            assert.deepEqual(
                mockReviewRepository.findReviews.mock.calls[0].arguments,
                [{ recordId: MOCK_RECORD_ID }, mockReviewPagination]
            );
            assert.deepEqual(result, mockReviews);
        });

        it('should throw ResourceNotFoundException when no reviews found', async () => {
            mockReviewRepository.findReviews.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            await assert.rejects(
                () =>
                    reviewService.getReviews(
                        MOCK_NONEXISTENT_RECORD_ID,
                        mockReviewPagination
                    ),
                (error) => {
                    assert.ok(error instanceof ResourceNotFoundException);
                    assert.strictEqual(
                        error.message,
                        `record with identifier ${MOCK_NONEXISTENT_RECORD_ID} not found`
                    );
                    return true;
                }
            );
        });
    });

    describe('getDiscogsScore', () => {
        it('should return discogs score when record exists and has discogsId', async () => {
            mockRecordService.getRecord.mock.mockImplementation(() =>
                Promise.resolve(mockDiscogsRecord)
            );
            mockDiscogsService.getReleaseScore.mock.mockImplementation(() =>
                Promise.resolve(mockDiscogsScore)
            );

            const result = await reviewService.getDiscogsScore(MOCK_RECORD_ID);

            assert.deepEqual(
                mockRecordService.getRecord.mock.calls[0].arguments,
                [MOCK_RECORD_ID]
            );
            assert.deepEqual(
                mockDiscogsService.getReleaseScore.mock.calls[0].arguments,
                [mockDiscogsRecord.discogsId]
            );
            assert.deepEqual(result, mockDiscogsScore);
        });

        it('should throw ResourceNotFoundException when record not found', async () => {
            mockRecordService.getRecord.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            await assert.rejects(
                () => reviewService.getDiscogsScore(MOCK_NONEXISTENT_RECORD_ID),
                (error) => {
                    assert.ok(error instanceof ResourceNotFoundException);
                    assert.strictEqual(
                        error.message,
                        `record with identifier ${MOCK_NONEXISTENT_RECORD_ID} not found`
                    );
                    return true;
                }
            );
        });

        it('should throw ValidationException when record has no discogsId', async () => {
            mockRecordService.getRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );

            await assert.rejects(
                () => reviewService.getDiscogsScore(MOCK_RECORD_ID),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(
                        error.message,
                        'Record with this id isnt synchronized with discogs'
                    );
                    assert.strictEqual(error.details, MOCK_RECORD_ID);
                    return true;
                }
            );
        });
    });

    describe('deleteReview', () => {
        it('should delete review when found', async () => {
            mockReviewRepository.findReview.mock.mockImplementation(() =>
                Promise.resolve(mockReview)
            );
            mockReviewRepository.destroyReview.mock.mockImplementation(() =>
                Promise.resolve()
            );

            await reviewService.deleteReview(MOCK_REVIEW_ID);

            assert.deepEqual(
                mockReviewRepository.findReview.mock.calls[0].arguments,
                [{ reviewId: MOCK_REVIEW_ID }]
            );
            assert.deepEqual(
                mockReviewRepository.destroyReview.mock.calls[0].arguments,
                [MOCK_REVIEW_ID]
            );
        });

        it('should throw ResourceNotFoundException when review not found', async () => {
            mockReviewRepository.findReview.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            await assert.rejects(
                () => reviewService.deleteReview(MOCK_NONEXISTENT_REVIEW_ID),
                (error) => {
                    assert.ok(error instanceof ResourceNotFoundException);
                    assert.strictEqual(
                        error.message,
                        `review with identifier ${MOCK_NONEXISTENT_REVIEW_ID} not found`
                    );
                    return true;
                }
            );
        });
    });
});
