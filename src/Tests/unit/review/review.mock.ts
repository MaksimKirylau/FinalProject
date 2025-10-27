import {
    CreateReviewDto,
    ReviewPresentationDto,
    ReviewsPresentationsDto,
} from '../../..//API/Review/review.api.dto';
import { ReviewEntity } from '../../..//Domain/Review/repository/review.model';
import {
    ReviewDto,
    ReviewsDto,
    ReviewsEntitiesDto,
} from '../../..//Domain/Review/review.dto';
import { PaginationDto } from '../../..//Utility/global.types';
import { DiscogsScoreDto } from '../../..//Utility/services/Discogs/discogs.dto';

export const mockReviewPagination: PaginationDto = {
    page: 1,
    limit: 8,
};

export const mockReviewInvalidPagination: PaginationDto = {
    page: 1,
    limit: 100,
};

export const mockNoReviewPagination: PaginationDto = {
    page: undefined,
    limit: undefined,
};

export const MOCK_REVIEW_ID: number = 1;
export const MOCK_NONEXISTENT_REVIEW_ID: number = 999;

export const mockCreateReview: CreateReviewDto = {
    comment: 'Comment 1',
    score: 5,
};

export const mockReviewPresentation: ReviewPresentationDto = {
    reviewId: 1,
    userId: 1,
    recordId: 1,
    comment: 'Comment 1',
    score: 5,
};

export const mockReviewsPresentation: ReviewsPresentationsDto = {
    reviewsPresentations: [mockReviewPresentation],
    reviewsCount: 1,
};

export const mockReview: ReviewDto = {
    reviewId: 1,
    userId: 1,
    recordId: 1,
    comment: 'Comment 1',
    score: 5,
    createdAt: '15.15.15',
};

export const mockReviews: ReviewsDto = {
    reviews: [mockReview],
    reviewsCount: 1,
};

export const mockReviewEntity: ReviewEntity = {
    dataValues: {
        reviewId: 1,
        userId: 1,
        recordId: 1,
        comment: 'Comment 1',
        score: 5,
        createdAt: '15.15.15',
    },
} as ReviewEntity;

export const mockReviewsEntities: ReviewsEntitiesDto = {
    rows: [mockReviewEntity],
    count: 1,
};

export const mockDiscogsScore: DiscogsScoreDto = {
    average: 4.5,
    count: 48,
};
