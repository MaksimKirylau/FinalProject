import { ReviewEntity } from './repository/review.model';

export class ReviewDto {
    reviewId: number;
    userId: number;
    recordId: number;
    comment: string;
    score: number;
    createdAt: string;
}

export class ReviewsDto {
    reviews: ReviewDto[];
    reviewsCount: number;
}

export class ReviewsEntitiesDto {
    rows: ReviewEntity[];
    count: number;
}
