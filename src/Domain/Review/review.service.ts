import { Inject, Injectable, Logger } from '@nestjs/common';
import { REVIEW_REPOSITORY } from './review.constants';
import type { IReviewRepository, IReviewService } from './review.interfaces';
import { ReviewDto, ReviewsDto } from './review.dto';
import { Optional, PaginationDto } from '../../Utility/global.types';
import { CreateReviewDto } from '../../API/Review/review.api.dto';
import {
    ResourceNotFoundException,
    ValidationException,
} from '../../Utility/errors/appExceptions/appException';
import { RECORD_SERVICE } from '../Record/record.constants';
import type { IRecordService } from '../Record/record.interfaces';
import { RecordDto } from '../Record/record.dto';
import { DiscogsScoreDto } from '../../Utility/services/Discogs/discogs.dto';
import type { IDiscogsService } from '../../Utility/services/Discogs/discogs.interfaces';
import { DISCOGS_SERVICE } from '../../Utility/services/Discogs/discogs.constants';

@Injectable()
export class ReviewService implements IReviewService {
    private readonly logger = new Logger(ReviewService.name);

    constructor(
        @Inject(REVIEW_REPOSITORY)
        private readonly reviewRepository: IReviewRepository,
        @Inject(RECORD_SERVICE) private readonly recordService: IRecordService,
        @Inject(DISCOGS_SERVICE)
        private readonly discogsService: IDiscogsService
    ) {}

    public async createReview(
        userId: number,
        recordId: number,
        dto: CreateReviewDto
    ): Promise<ReviewDto> {
        this.logger.log(`Creating review to record: ${recordId}`);

        const record: RecordDto = await this.recordService.getRecord(recordId);

        if (!record) {
            throw new ResourceNotFoundException('record', recordId);
        }

        const candidate: Optional<ReviewDto> =
            await this.reviewRepository.findReview({
                userId: userId,
                recordId: recordId,
            });

        if (candidate) {
            throw new ValidationException(
                'You already got review for that record',
                recordId
            );
        }

        const review: ReviewDto = await this.reviewRepository.createReview(
            userId,
            recordId,
            dto
        );

        this.logger.log(`Review created successfully: id=${review.reviewId}`);
        return review;
    }

    public async getReviews(
        recordId: number,
        pagination: PaginationDto
    ): Promise<ReviewsDto> {
        const reviews: ReviewsDto = await this.reviewRepository.findReviews(
            { recordId: recordId },
            pagination
        );

        if (!reviews) {
            throw new ResourceNotFoundException('record', recordId);
        }

        return reviews;
    }

    public async getDiscogsScore(recordId: number): Promise<DiscogsScoreDto> {
        const record: Optional<RecordDto> =
            await this.recordService.getRecord(recordId);

        if (!record) {
            throw new ResourceNotFoundException('record', recordId);
        }

        if (record.discogsId === null) {
            throw new ValidationException(
                'Record with this id isnt synchronized with discogs',
                recordId
            );
        }

        const discogsScore: DiscogsScoreDto =
            await this.discogsService.getReleaseScore(record.discogsId);
        return discogsScore;
    }

    public async deleteReview(reviewId: number): Promise<void> {
        this.logger.warn(`Deleting review id=${reviewId}`);

        const candidate: Optional<ReviewDto> =
            await this.reviewRepository.findReview({ reviewId: reviewId });

        if (!candidate) {
            throw new ResourceNotFoundException('review', reviewId);
        }

        await this.reviewRepository.destroyReview(reviewId);
        this.logger.log(`Review deleted successfully: id=${reviewId}`);
    }
}
