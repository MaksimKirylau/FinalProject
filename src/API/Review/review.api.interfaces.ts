import { RequestUserDto } from '../../Auth/authentification/auth.dto';
import { ReviewDto, ReviewsDto } from '../../Domain/Review/review.dto';
import {
    CreateReviewDto,
    ReviewPresentationDto,
    ReviewsPresentationsDto,
} from './review.api.dto';
import { DiscogsScoreDto } from '../../Utility/services/Discogs/discogs.dto';
import { PaginationDto } from '../../Utility/global.types';

export interface IReviewController {
    createReview(
        requestUser: RequestUserDto,
        recordId: number,
        dto: CreateReviewDto
    ): Promise<ReviewPresentationDto>;
    getReviews(
        recordId: number,
        pagination: PaginationDto
    ): Promise<ReviewsPresentationsDto>;
    getDiscogsScore(recordId: number): Promise<DiscogsScoreDto>;
    deleteReview(reviewId: number): Promise<void>;
}

export interface IReviewApiMapper {
    reviewToPresentation(dto: ReviewDto): ReviewPresentationDto;
    reviewsToPresentation(dto: ReviewsDto): ReviewsPresentationsDto;
}
