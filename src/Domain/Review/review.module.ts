import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewEntity } from './repository/review.model';
import { ReviewRepository } from './repository/review.repository';
import {
    REVIEW_SERVICE,
    REVIEW_REPOSITORY,
    REVIEW_MAPPERS,
} from './review.constants';
import { ReviewMappers } from './review.mappers';
import { ReviewService } from './review.service';
import { DiscogsModule } from '../../Utility/services/Discogs/discogs.module';
import { RecordModule } from '../Record/record.module';

@Module({
    providers: [
        { provide: REVIEW_SERVICE, useClass: ReviewService },
        { provide: REVIEW_REPOSITORY, useClass: ReviewRepository },
        { provide: REVIEW_MAPPERS, useClass: ReviewMappers },
    ],
    imports: [
        SequelizeModule.forFeature([ReviewEntity]),
        RecordModule,
        DiscogsModule,
    ],
    exports: [REVIEW_SERVICE],
})
export class ReviewModule {}
