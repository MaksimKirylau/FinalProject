import {
    CreateDiscogsRecordDto,
    CreateRecordDto,
    RecordFilterDto,
    RecordSortDto,
    UpdateRecordDto,
} from '../../API/Record/record.api.dto';
import { RecordEntity } from './repository/record.repository.model';
import {
    RecordDto,
    RecordsDto,
    RecordsEntitiesDto,
    RecordsListDto,
} from './record.dto';
import { Optional, PaginationDto } from '../../Utility/global.types';

export interface IRecordService {
    getRecord(recordId: number): Promise<RecordDto>;
    getRecords(
        pagination: PaginationDto,
        sort: RecordSortDto,
        filter: RecordFilterDto
    ): Promise<RecordsDto>;
    getRecordsList(pagination: PaginationDto): Promise<RecordsListDto>;
    createRecord(dto: CreateRecordDto): Promise<RecordDto>;
    createDiscogsRecord(dto: CreateDiscogsRecordDto): Promise<RecordDto>;
    updateRecord(recordId: number, dto: UpdateRecordDto): Promise<void>;
    deleteRecord(recordId: number): Promise<void>;
}

export interface IRecordRepository {
    findRecords(
        pagination: PaginationDto,
        sort: RecordSortDto,
        filter: RecordFilterDto
    ): Promise<RecordsDto>;
    findRecordsList(pagination: PaginationDto): Promise<RecordsListDto>;
    findRecord(filter: Partial<RecordDto>): Promise<Optional<RecordDto>>;
    createRecord(dto: CreateRecordDto): Promise<RecordDto>;
    updateRecord(recordId: number, dto: UpdateRecordDto): Promise<void>;
    destroyRecord(recordId: number): Promise<void>;
}

export interface IRecordMappers {
    recordEntityToRecord(dto: RecordEntity): RecordDto;
    recordsEntitiesToRecords(dto: RecordsEntitiesDto): RecordsDto;
}
