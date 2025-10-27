import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { ReviewController } from '../../../API/Review/review.controller';
import {
    MOCK_REVIEW_ID,
    mockCreateReview,
    mockDiscogsScore,
    mockNoReviewPagination,
    mockReview,
    mockReviewPagination,
    mockReviewPresentation,
    mockReviews,
} from './review.mock';
import { MOCK_RECORD_ID } from '../record/record.mock';
import { mockRequestUser } from '../user/user.mock';

describe('ReviewController Decorators', () => {
    let reviewController: ReviewController;
    let mockReviewService;
    let mockReviewApiMapper;

    beforeEach(() => {
        mock.reset();

        mockReviewService = {
            getReviews: mock.fn(),
            getDiscogsScore: mock.fn(),
            createReview: mock.fn(),
            deleteReview: mock.fn(),
        };

        mockReviewApiMapper = {
            reviewsToPresentation: mock.fn(),
            reviewToPresentation: mock.fn(),
        };

        reviewController = new ReviewController(
            mockReviewService,
            mockReviewApiMapper
        );
    });

    describe('getReviews', () => {
        it('should return mapped reviews for record with pagination', async () => {
            mockReviewService.getReviews.mock.mockImplementation(() =>
                Promise.resolve(mockReviews)
            );
            mockReviewApiMapper.reviewsToPresentation.mock.mockImplementation(
                () => mockReviewPresentation
            );

            const result = await reviewController.getReviews(
                MOCK_RECORD_ID,
                mockReviewPagination
            );

            assert.deepEqual(
                mockReviewService.getReviews.mock.calls[0].arguments,
                [MOCK_RECORD_ID, mockReviewPagination]
            );
            assert.deepEqual(
                mockReviewApiMapper.reviewsToPresentation.mock.calls[0]
                    .arguments,
                [mockReviews]
            );
            assert.deepEqual(result, mockReviewPresentation);
        });

        it('should handle empty pagination options', async () => {
            mockReviewService.getReviews.mock.mockImplementation(() =>
                Promise.resolve(mockReviews)
            );
            mockReviewApiMapper.reviewsToPresentation.mock.mockImplementation(
                () => mockReviewPresentation
            );

            const result = await reviewController.getReviews(
                MOCK_RECORD_ID,
                mockNoReviewPagination
            );

            assert.deepEqual(result, mockReviewPresentation);
        });
    });

    describe('createReview', () => {
        it('should create and return mapped review with user and record data', async () => {
            mockReviewService.createReview.mock.mockImplementation(() =>
                Promise.resolve(mockReview)
            );
            mockReviewApiMapper.reviewToPresentation.mock.mockImplementation(
                () => mockReviewPresentation
            );

            const result = await reviewController.createReview(
                mockRequestUser,
                MOCK_RECORD_ID,
                mockCreateReview
            );

            assert.deepEqual(
                mockReviewService.createReview.mock.calls[0].arguments,
                [mockRequestUser.userId, MOCK_RECORD_ID, mockCreateReview]
            );
            assert.deepEqual(
                mockReviewApiMapper.reviewToPresentation.mock.calls[0]
                    .arguments,
                [mockReview]
            );
            assert.deepEqual(result, mockReviewPresentation);
        });
    });

    describe('deleteReview', () => {
        it('should delete review with correct ID', async () => {
            mockReviewService.deleteReview.mock.mockImplementation(() =>
                Promise.resolve()
            );

            await reviewController.deleteReview(MOCK_REVIEW_ID);

            assert.deepEqual(
                mockReviewService.deleteReview.mock.calls[0].arguments,
                [MOCK_REVIEW_ID]
            );
        });
    });

    describe('getDiscogsScore', () => {
        it('should return descogs record score', async () => {
            mockReviewService.getDiscogsScore.mock.mockImplementation(() =>
                Promise.resolve(mockDiscogsScore)
            );

            const result =
                await reviewController.getDiscogsScore(MOCK_RECORD_ID);

            assert.deepEqual(
                mockReviewService.getDiscogsScore.mock.calls[0].arguments,
                [MOCK_RECORD_ID]
            );
            assert.deepEqual(result, mockDiscogsScore);
        });
    });
});
