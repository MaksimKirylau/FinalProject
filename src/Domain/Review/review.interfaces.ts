import { ReviewEntity } from './repository/review.model';
import { ReviewDto, ReviewsDto, ReviewsEntitiesDto } from './review.dto';
import { Optional, PaginationDto } from '../../Utility/global.types';
import { CreateReviewDto } from '../../API/Review/review.api.dto';
import { DiscogsScoreDto } from '../../Utility/services/Discogs/discogs.dto';

export interface IReviewService {
    createReview(
        userId: number,
        recordId: number,
        dto: CreateReviewDto
    ): Promise<ReviewDto>;
    getReviews(
        recordId: number,
        pagination: PaginationDto
    ): Promise<ReviewsDto>;
    getDiscogsScore(recordId: number): Promise<DiscogsScoreDto>;
    deleteReview(reviewId: number): Promise<void>;
}

export interface IReviewRepository {
    createReview(
        userId: number,
        recordId: number,
        dto: CreateReviewDto
    ): Promise<ReviewDto>;
    findReview(filter: Partial<ReviewDto>): Promise<Optional<ReviewDto>>;
    findReviews(
        filter: Partial<ReviewDto>,
        pagination: PaginationDto
    ): Promise<ReviewsDto>;
    destroyReview(reviewId: number): Promise<void>;
}

export interface IReviewMappers {
    reviewEntityToReview(dto: ReviewEntity): ReviewDto;
    reviewsEntitiesToReviews(dto: ReviewsEntitiesDto): ReviewsDto;
}
