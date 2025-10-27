import { Injectable } from '@nestjs/common';
import { ReviewDto, ReviewsDto } from '../../Domain/Review/review.dto';
import {
    ReviewPresentationDto,
    ReviewsPresentationsDto,
} from './review.api.dto';
import { IReviewApiMapper } from './review.api.interfaces';

@Injectable()
export class ReviewApiMapper implements IReviewApiMapper {
    public reviewToPresentation(dto: ReviewDto): ReviewPresentationDto {
        return {
            reviewId: dto.reviewId,
            userId: dto.userId,
            recordId: dto.recordId,
            comment: dto.comment,
            score: dto.score,
        };
    }

    public reviewsToPresentation(dto: ReviewsDto): ReviewsPresentationsDto {
        return {
            reviewsPresentations: dto.reviews.map((review) =>
                this.reviewToPresentation(review)
            ),
            reviewsCount: dto.reviewsCount,
        };
    }
}
