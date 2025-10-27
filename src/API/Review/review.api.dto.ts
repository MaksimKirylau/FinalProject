import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    Min,
} from 'class-validator';
import { REVIEW_MAX_SCORE, REVIEW_MIN_SCORE } from './review.api.constants';

export class CreateReviewDto {
    @ApiProperty({ example: 'Comment 1', description: 'Text of review' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    comment: string;

    @ApiProperty({ example: '3', description: 'Review score' })
    @IsDefined()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(REVIEW_MIN_SCORE)
    @Max(REVIEW_MAX_SCORE)
    score: number;
}

export class ReviewPresentationDto {
    @ApiProperty({ example: '1', description: 'Review id in database' })
    reviewId: number;
    @ApiProperty({
        example: '1',
        description: 'Id of the user who left the review',
    })
    userId: number;
    @ApiProperty({
        example: '1',
        description: 'Id of the post that was reviewed',
    })
    recordId: number;
    @ApiProperty({ example: 'Comment 1', description: 'Text of review' })
    comment: string;
    @ApiProperty({ example: 3, description: 'Review score' })
    score: number;
}

export class ReviewsPresentationsDto {
    @ApiProperty({
        example:
            '[{"reviewId": 1, "userId": 1, "recordId": 1, "comment": "Comment 1", "score": 3}]',
        description: 'Array of records reviews',
    })
    reviewsPresentations: ReviewPresentationDto[];
    @ApiProperty({ example: '1', description: 'Amount of found reviews' })
    reviewsCount: number;
}
