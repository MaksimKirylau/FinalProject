import { Inject, Injectable, Logger } from '@nestjs/common';
import { RECORD_REPOSITORY } from './record.constants';
import type { IRecordRepository, IRecordService } from './record.interfaces';
import {
    CreateDiscogsRecordDto,
    CreateRecordDto,
    RecordFilterDto,
    RecordSortDto,
    UpdateRecordDto,
} from '../../API/Record/record.api.dto';
import { RecordDto, RecordsDto, RecordsListDto } from './record.dto';
import { Optional, PaginationDto } from '../../Utility/global.types';
import {
    ResourceNotFoundException,
    ValidationException,
} from '../../Utility/errors/appExceptions/appException';
import { DISCOGS_SERVICE } from '../../Utility/services/Discogs/discogs.constants';
import type { IDiscogsService } from '../../Utility/services/Discogs/discogs.interfaces';
import { DiscogsReleaseDto } from '../../Utility/services/Discogs/discogs.dto';

@Injectable()
export class RecordService implements IRecordService {
    private readonly logger = new Logger(RecordService.name);

    constructor(
        @Inject(RECORD_REPOSITORY)
        private readonly recordRepository: IRecordRepository,
        @Inject(DISCOGS_SERVICE)
        private readonly discogsService: IDiscogsService
    ) {}

    public async getRecord(recordId: number): Promise<RecordDto> {
        const record: Optional<RecordDto> =
            await this.recordRepository.findRecord({ recordId: recordId });

        if (!record) {
            throw new ResourceNotFoundException('record', recordId);
        }

        return record;
    }

    public async getRecords(
        dto: PaginationDto,
        sort: RecordSortDto,
        filter: RecordFilterDto
    ): Promise<RecordsDto> {
        const records: RecordsDto = await this.recordRepository.findRecords(
            dto,
            sort,
            filter
        );

        return records;
    }

    public async getRecordsList(
        pagination: PaginationDto
    ): Promise<RecordsListDto> {
        const recordsList: RecordsListDto =
            await this.recordRepository.findRecordsList(pagination);

        return recordsList;
    }

    public async createRecord(dto: CreateRecordDto): Promise<RecordDto> {
        this.logger.log(`Creating record with name: ${dto.name}`);

        const candidate: Optional<RecordDto> =
            await this.recordRepository.findRecord({
                name: dto.name,
                authorName: dto.authorName,
            });

        if (candidate) {
            throw new ValidationException(
                'Record with this name/author already exists',
                dto.name
            );
        }

        const record: RecordDto = await this.recordRepository.createRecord(dto);

        this.logger.log(`Record created successfully: id=${record.recordId}`);
        return record;
    }

    public async createDiscogsRecord(
        dto: CreateDiscogsRecordDto
    ): Promise<RecordDto> {
        this.logger.log(
            `Creating discogs record with discogs id: ${dto.discogsId}`
        );

        const candidate: Optional<RecordDto> =
            await this.recordRepository.findRecord({
                discogsId: dto.discogsId,
            });

        if (candidate) {
            throw new ValidationException(
                'Record with this discogs id already exists',
                dto.discogsId
            );
        }

        const discogsRelease: DiscogsReleaseDto =
            await this.discogsService.getReleaseDetails(dto.discogsId);
        const record: RecordDto = await this.recordRepository.createRecord({
            name: discogsRelease.title,
            authorName: discogsRelease.artists,
            price: discogsRelease.price,
            ...dto,
        });
        this.logger.log(
            `Discogs record created successfully: id=${record.recordId}`
        );
        return record;
    }

    public async updateRecord(
        recordId: number,
        dto: UpdateRecordDto
    ): Promise<void> {
        this.logger.log(`Updating record id=${recordId}`);

        const candidate: Optional<RecordDto> =
            await this.recordRepository.findRecord({ recordId: recordId });

        if (!candidate) {
            throw new ResourceNotFoundException('record', recordId);
        }

        if (Object.keys(dto).length === 0) {
            throw new ValidationException('No updates to implement');
        }

        await this.recordRepository.updateRecord(recordId, dto);
        this.logger.log(`Record updated successfully: id=${recordId}`);
    }

    public async deleteRecord(recordId: number): Promise<void> {
        this.logger.warn(`Deleting record id=${recordId}`);

        const candidate: Optional<RecordDto> =
            await this.recordRepository.findRecord({ recordId: recordId });

        if (!candidate) {
            throw new ResourceNotFoundException('record', recordId);
        }

        await this.recordRepository.destroyRecord(recordId);
        this.logger.log(`Record deleted successfully: id=${recordId}`);
    }
}
