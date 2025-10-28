import { Inject, Injectable } from '@nestjs/common';
import {
    DEFAULT_LIMIT,
    DEFAULT_PAGE,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_ORDER,
    RECORD_MAPPERS,
} from '../record.constants';
import { InjectModel } from '@nestjs/sequelize';
import { RecordEntity } from './record.repository.model';
import type { IRecordMappers, IRecordRepository } from '../record.interfaces';
import { SEQUELIZE } from '../../../Database/database.constants';
import { Sequelize } from 'sequelize-typescript';
import {
    CreateRecordDto,
    RecordFilterDto,
    RecordSortDto,
    UpdateRecordDto,
} from '../../../API/Record/record.api.dto';
import {
    RecordDto,
    RecordListDto,
    RecordsDto,
    RecordsEntitiesDto,
    RecordsListDto,
} from '../record.dto';
import { Optional, PaginationDto } from '../../../Utility/global.types';
import { QueryTypes, WhereOptions } from 'sequelize';

@Injectable()
export class RecordRepository implements IRecordRepository {
    constructor(
        @InjectModel(RecordEntity) private recordDb: typeof RecordEntity,
        @Inject(RECORD_MAPPERS)
        private readonly recordRepoMappers: IRecordMappers,
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize
    ) {}

    public async createRecord(dto: CreateRecordDto): Promise<RecordDto> {
        const recordEntity: RecordEntity = await this.recordDb.create(dto);
        const record: RecordDto =
            this.recordRepoMappers.recordEntityToRecord(recordEntity);
        return record;
    }

    public async updateRecord(
        recordId: number,
        dto: UpdateRecordDto
    ): Promise<void> {
        await this.recordDb.update(dto, { where: { recordId: recordId } });
    }

    public async findRecord(
        filter: Partial<RecordDto>
    ): Promise<Optional<RecordDto>> {
        const recordEntity: Optional<RecordEntity> =
            await this.recordDb.findOne({ where: filter });

        if (recordEntity) {
            const record: RecordDto =
                this.recordRepoMappers.recordEntityToRecord(recordEntity);
            return record;
        }

        return recordEntity;
    }

    public async findRecords(
        pagination: PaginationDto,
        sort: RecordSortDto,
        filter: RecordFilterDto
    ): Promise<RecordsDto> {
        // eslint-disable-next-line prefer-const
        let { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = pagination;

        const { sortBy = DEFAULT_SORT_BY, sortOrder = DEFAULT_SORT_ORDER } =
            sort;

        if (limit > DEFAULT_LIMIT) {
            limit = DEFAULT_LIMIT;
        }

        const offset = (page - 1) * limit;

        const where: WhereOptions<RecordEntity> = {};

        if (filter?.name) {
            where['name'] = filter.name;
        }

        if (filter?.authorName) {
            where['authorName'] = filter.authorName;
        }

        const result: RecordsEntitiesDto = await this.recordDb.findAndCountAll({
            where: where,
            order: [[sortBy, sortOrder]],
            limit: limit,
            offset: offset,
        });

        const records: RecordsDto =
            this.recordRepoMappers.recordsEntitiesToRecords(result);

        return records;
    }

    public async findRecordsList(
        pagination: PaginationDto
    ): Promise<RecordsListDto> {
        // eslint-disable-next-line prefer-const
        let { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = pagination;

        if (limit > DEFAULT_LIMIT) {
            limit = DEFAULT_LIMIT;
        }

        const offset = (page - 1) * limit;

        const count: { count: number }[] = await this.sequelize.query(
            'SELECT COUNT(*) AS count FROM records',
            { type: QueryTypes.SELECT }
        );

        const recordsCount: number = count[0].count;

        const result: RecordListDto[] = await this.sequelize.query(
            `
            SELECT 
                records.*,
                first_review.*,
                average_reviews.averageScore
            FROM records
            LEFT JOIN (
                SELECT 
                    reviews.*
                FROM reviews
                WHERE reviews.reviewId IN (
                    SELECT MIN(inner_reviews.reviewId)
                    FROM reviews AS inner_reviews
                    GROUP BY inner_reviews.recordId
                )
            ) AS first_review ON records.recordId = first_review.recordId
            LEFT JOIN (
                SELECT 
                    recordId,
                    AVG(score) AS averageScore
                FROM reviews
                GROUP BY recordId
            ) AS average_reviews ON records.recordId = average_reviews.recordId
            ORDER BY records.recordId ASC
            LIMIT :limit OFFSET :offset;`,
            {
                type: QueryTypes.SELECT,
                replacements: { limit, offset },
            }
        );

        return {
            records: result,
            recordsCount: recordsCount,
        };
    }

    public async destroyRecord(recordId: number): Promise<void> {
        await this.recordDb.destroy({ where: { recordId: recordId } });
    }
}
