import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PoliciesGuard } from '../../Auth/authorization/guards/casl.guard';
import { REVIEW_API_MAPPER } from './review.api.constants';
import { CheckAbilities } from '../../Utility/decorators/casl.decorator';
import { Action } from '../../Auth/authorization/casl-ability.factory';
import { REVIEW_SERVICE } from '../../Domain/Review/review.constants';
import type {
    IReviewApiMapper,
    IReviewController,
} from './review.api.interfaces';
import type { IReviewService } from '../../Domain/Review/review.interfaces';
import { ReviewDto, ReviewsDto } from '../../Domain/Review/review.dto';
import {
    CreateReviewDto,
    ReviewPresentationDto,
    ReviewsPresentationsDto,
} from './review.api.dto';
import { RequestUser } from '../../Utility/decorators/user.decorator';
import { RequestUserDto } from '../../Auth/authentification/auth.dto';
import { DiscogsScoreDto } from '../../Utility/services/Discogs/discogs.dto';
import { PaginationDto } from '../../Utility/global.types';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('review')
@UseGuards(PoliciesGuard)
export class ReviewController implements IReviewController {
    constructor(
        @Inject(REVIEW_SERVICE) private readonly reviewService: IReviewService,
        @Inject(REVIEW_API_MAPPER)
        private readonly reviewApiMapper: IReviewApiMapper
    ) {}

    @ApiOperation({ summary: 'Get all the reviews for specific record' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns paginated review list',
        type: ReviewsPresentationsDto,
    })
    @CheckAbilities({ action: Action.Read, subject: ReviewDto })
    @Get('/:id')
    public async getReviews(
        @Param('id', ParseIntPipe) recordId: number,
        @Query() paginationOptions: PaginationDto
    ): Promise<ReviewsPresentationsDto> {
        const reviews: ReviewsDto = await this.reviewService.getReviews(
            recordId,
            paginationOptions
        );
        const reviewsPresentation: ReviewsPresentationsDto =
            this.reviewApiMapper.reviewsToPresentation(reviews);
        return reviewsPresentation;
    }

    @ApiOperation({
        summary: 'Retrieves average score for record from discogs',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns average score and reviewers count',
        type: DiscogsScoreDto,
    })
    @CheckAbilities({ action: Action.Read, subject: DiscogsScoreDto })
    @Get('/discogs/score/:id')
    public async getDiscogsScore(
        @Param('id', ParseIntPipe) recordId: number
    ): Promise<DiscogsScoreDto> {
        const discogsScore: DiscogsScoreDto =
            await this.reviewService.getDiscogsScore(recordId);
        return discogsScore;
    }

    @ApiOperation({ summary: 'Creates review for record' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Returns created review',
        type: ReviewPresentationDto,
    })
    @CheckAbilities({ action: Action.Create, subject: ReviewDto })
    @Post('/:id')
    public async createReview(
        @RequestUser() requestUser: RequestUserDto,
        @Param('id', ParseIntPipe) recordId: number,
        @Body() dto: CreateReviewDto
    ): Promise<ReviewPresentationDto> {
        const review: ReviewDto = await this.reviewService.createReview(
            requestUser.userId,
            recordId,
            dto
        );
        const reviewPresentation: ReviewPresentationDto =
            this.reviewApiMapper.reviewToPresentation(review);
        return reviewPresentation;
    }

    @ApiOperation({ summary: 'Deletes specific review. Only for admin' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns code 200 upon successful delete',
    })
    @CheckAbilities({ action: Action.Delete, subject: ReviewDto })
    @Delete('/:id')
    public async deleteReview(
        @Param('id', ParseIntPipe) reviewId: number
    ): Promise<void> {
        await this.reviewService.deleteReview(reviewId);
    }
}
