import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { ReviewRepository } from '../../../Domain/Review/repository/review.repository';
import {
    MOCK_NONEXISTENT_REVIEW_ID,
    MOCK_REVIEW_ID,
    mockCreateReview,
    mockNoReviewPagination,
    mockReview,
    mockReviewEntity,
    mockReviewInvalidPagination,
    mockReviewPagination,
    mockReviews,
    mockReviewsEntities,
} from './review.mock';
import { MOCK_USER_ID } from '../user/user.mock';
import { MOCK_RECORD_ID } from '../record/record.mock';
import {
    DEFAULT_LIMIT,
    DEFAULT_PAGE,
} from '../../../Domain/Review/review.constants';

describe('ReviewRepository', () => {
    let reviewRepository: ReviewRepository;
    let mockReviewDb;
    let mockReviewMappers;

    beforeEach(() => {
        mock.reset();

        mockReviewDb = {
            create: mock.fn(),
            findOne: mock.fn(),
            findAndCountAll: mock.fn(),
            destroy: mock.fn(),
        };

        mockReviewMappers = {
            reviewEntityToReview: mock.fn(),
            reviewsEntitiesToReviews: mock.fn(),
        };

        reviewRepository = new ReviewRepository(
            mockReviewDb,
            mockReviewMappers
        );
    });

    describe('createReview', () => {
        it('should create review with userId, recordId and dto data', async () => {
            mockReviewDb.create.mock.mockImplementation(() =>
                Promise.resolve(mockReviewEntity)
            );
            mockReviewMappers.reviewEntityToReview.mock.mockImplementation(
                () => mockReview
            );

            const result = await reviewRepository.createReview(
                MOCK_USER_ID,
                MOCK_RECORD_ID,
                mockCreateReview
            );

            assert.deepStrictEqual(
                mockReviewDb.create.mock.calls[0].arguments,
                [
                    {
                        userId: MOCK_USER_ID,
                        recordId: MOCK_RECORD_ID,
                        ...mockCreateReview,
                    },
                ]
            );
            assert.strictEqual(result, mockReview);
        });
    });

    describe('findReview', () => {
        it('should return mapped review when found', async () => {
            mockReviewDb.findOne.mock.mockImplementation(() =>
                Promise.resolve(mockReviewEntity)
            );
            mockReviewMappers.reviewEntityToReview.mock.mockImplementation(
                () => mockReview
            );

            const result = await reviewRepository.findReview({
                reviewId: MOCK_REVIEW_ID,
            });

            assert.deepStrictEqual(
                mockReviewDb.findOne.mock.calls[0].arguments,
                [{ where: { reviewId: MOCK_REVIEW_ID } }]
            );
            assert.strictEqual(result, mockReview);
        });

        it('should return null when review not found', async () => {
            mockReviewDb.findOne.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            const result = await reviewRepository.findReview({
                reviewId: MOCK_NONEXISTENT_REVIEW_ID,
            });

            assert.deepStrictEqual(
                mockReviewDb.findOne.mock.calls[0].arguments,
                [{ where: { reviewId: MOCK_NONEXISTENT_REVIEW_ID } }]
            );
            assert.strictEqual(result, null);
        });

        it('should handle different filter combinations', async () => {
            mockReviewDb.findOne.mock.mockImplementation(() =>
                Promise.resolve(mockReviewEntity)
            );
            mockReviewMappers.reviewEntityToReview.mock.mockImplementation(
                () => mockReview
            );

            const result = await reviewRepository.findReview({
                reviewId: MOCK_REVIEW_ID,
                userId: MOCK_USER_ID,
            });

            assert.deepStrictEqual(
                mockReviewDb.findOne.mock.calls[0].arguments,
                [{ where: { reviewId: MOCK_REVIEW_ID, userId: MOCK_USER_ID } }]
            );
            assert.strictEqual(result, mockReview);
        });
    });

    describe('findReviews', () => {
        it('should return mapped reviews with default pagination', async () => {
            mockReviewDb.findAndCountAll.mock.mockImplementation(() =>
                Promise.resolve(mockReviewsEntities)
            );
            mockReviewMappers.reviewsEntitiesToReviews.mock.mockImplementation(
                () => mockReviews
            );

            const result = await reviewRepository.findReviews(
                {},
                mockNoReviewPagination
            );

            assert.deepStrictEqual(
                mockReviewDb.findAndCountAll.mock.calls[0].arguments,
                [
                    {
                        limit: DEFAULT_LIMIT,
                        offset: (DEFAULT_PAGE - 1) * DEFAULT_LIMIT,
                        where: {},
                    },
                ]
            );

            assert.strictEqual(result, mockReviews);
        });

        it('should apply custom parameters', async () => {
            mockReviewDb.findAndCountAll.mock.mockImplementation(() =>
                Promise.resolve(mockReviewsEntities)
            );
            mockReviewMappers.reviewsEntitiesToReviews.mock.mockImplementation(
                () => mockReviews
            );

            const result = await reviewRepository.findReviews(
                { recordId: MOCK_RECORD_ID },
                mockReviewPagination
            );

            assert.deepStrictEqual(
                mockReviewDb.findAndCountAll.mock.calls[0].arguments,
                [
                    {
                        limit: mockReviewPagination.limit,
                        offset:
                            (mockReviewPagination.page! - 1) *
                            mockReviewPagination.limit!,
                        where: { recordId: MOCK_RECORD_ID },
                    },
                ]
            );

            assert.strictEqual(result, mockReviews);
        });

        it('should limit maximum page size to DEFAULT_LIMIT', async () => {
            mockReviewDb.findAndCountAll.mock.mockImplementation(() =>
                Promise.resolve(mockReviewsEntities)
            );

            await reviewRepository.findReviews({}, mockReviewInvalidPagination);

            assert.deepStrictEqual(
                mockReviewDb.findAndCountAll.mock.calls[0].arguments,
                [
                    {
                        limit: DEFAULT_LIMIT,
                        offset:
                            (mockReviewPagination.page! - 1) * DEFAULT_LIMIT,
                        where: {},
                    },
                ]
            );
        });
    });

    describe('destroyReview', () => {
        it('should destroy review with correct ID', async () => {
            mockReviewDb.destroy.mock.mockImplementation(() =>
                Promise.resolve()
            );

            await reviewRepository.destroyReview(MOCK_REVIEW_ID);

            assert.deepStrictEqual(
                mockReviewDb.destroy.mock.calls[0].arguments,
                [{ where: { reviewId: MOCK_REVIEW_ID } }]
            );
        });
    });
});
