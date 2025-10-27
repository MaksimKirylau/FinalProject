import { Injectable } from '@nestjs/common';
import { ReviewEntity } from './repository/review.model';
import { ReviewDto, ReviewsEntitiesDto, ReviewsDto } from './review.dto';
import { IReviewMappers } from './review.interfaces';

@Injectable()
export class ReviewMappers implements IReviewMappers {
    public reviewEntityToReview(dto: ReviewEntity): ReviewDto {
        return {
            reviewId: dto.dataValues.recordId,
            userId: dto.dataValues.userId,
            recordId: dto.dataValues.recordId,
            comment: dto.dataValues.comment,
            score: dto.dataValues.score,
            createdAt: dto.dataValues.createdAt,
        };
    }

    public reviewsEntitiesToReviews(dto: ReviewsEntitiesDto): ReviewsDto {
        return {
            reviews: dto.rows.map((reviewEntity) =>
                this.reviewEntityToReview(reviewEntity)
            ),
            reviewsCount: dto.count,
        };
    }
}
