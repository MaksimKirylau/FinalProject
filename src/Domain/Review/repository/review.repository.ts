import { Inject, Injectable } from '@nestjs/common';
import { ReviewEntity } from './review.model';
import {
    DEFAULT_LIMIT,
    DEFAULT_PAGE,
    REVIEW_MAPPERS,
} from '../review.constants';
import { InjectModel } from '@nestjs/sequelize';
import type { IReviewMappers, IReviewRepository } from '../review.interfaces';
import { ReviewDto, ReviewsDto, ReviewsEntitiesDto } from '../review.dto';
import { Optional, PaginationDto } from '../../../Utility/global.types';
import { CreateReviewDto } from '../../../API/Review/review.api.dto';

@Injectable()
export class ReviewRepository implements IReviewRepository {
    constructor(
        @InjectModel(ReviewEntity) private reviewDb: typeof ReviewEntity,
        @Inject(REVIEW_MAPPERS)
        private readonly reviewRepoMappers: IReviewMappers
    ) {}

    public async createReview(
        userId: number,
        recordId: number,
        dto: CreateReviewDto
    ): Promise<ReviewDto> {
        const reviewEntity: ReviewEntity = await this.reviewDb.create({
            userId: userId,
            recordId: recordId,
            ...dto,
        });
        const review: ReviewDto =
            this.reviewRepoMappers.reviewEntityToReview(reviewEntity);
        return review;
    }

    public async findReview(
        filter: Partial<ReviewDto>
    ): Promise<Optional<ReviewDto>> {
        const reviewEntity = await this.reviewDb.findOne({ where: filter });

        if (reviewEntity) {
            const review: ReviewDto =
                this.reviewRepoMappers.reviewEntityToReview(reviewEntity);
            return review;
        }

        return reviewEntity;
    }

    public async findReviews(
        filter: Partial<ReviewDto>,
        pagination: PaginationDto
    ): Promise<ReviewsDto> {
        // eslint-disable-next-line prefer-const
        let { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = pagination;

        if (limit > DEFAULT_LIMIT) {
            limit = DEFAULT_LIMIT;
        }

        const offset = (page - 1) * limit;

        const result: ReviewsEntitiesDto = await this.reviewDb.findAndCountAll({
            limit: limit,
            offset: offset,
            where: filter,
        });

        const reviews: ReviewsDto =
            this.reviewRepoMappers.reviewsEntitiesToReviews(result);

        return reviews;
    }

    public async destroyReview(reviewId: number): Promise<void> {
        await this.reviewDb.destroy({ where: { reviewId: reviewId } });
    }
}
