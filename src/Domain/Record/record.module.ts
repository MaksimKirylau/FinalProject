import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '../../Database/database.module';
import { RecordEntity } from './repository/record.repository.model';
import {
    RECORD_MAPPERS,
    RECORD_REPOSITORY,
    RECORD_SERVICE,
} from './record.constants';
import { RecordService } from './record.service';
import { RecordMappers } from './record.mappers';
import { RecordRepository } from './repository/records.repository';
import { ReviewEntity } from '../Review/repository/review.model';
import { DiscogsModule } from '../../Utility/services/Discogs/discogs.module';

@Module({
    providers: [
        { provide: RECORD_SERVICE, useClass: RecordService },
        { provide: RECORD_REPOSITORY, useClass: RecordRepository },
        { provide: RECORD_MAPPERS, useClass: RecordMappers },
    ],
    imports: [
        DatabaseModule,
        SequelizeModule.forFeature([RecordEntity, ReviewEntity]),
        DiscogsModule,
    ],
    exports: [RECORD_SERVICE],
})
export class RecordModule {}
