import {
    RecordDto,
    RecordListDto,
    RecordsDto,
    RecordsListDto,
} from '../../Domain/Record/record.dto';
import {
    RecordsPresentationsDto,
    RecordPresentationDto,
    CreateRecordDto,
    UpdateRecordDto,
    RecordsListPresentationDto,
    RecordListPresentationDto,
    RecordSortDto,
    RecordFilterDto,
    CreateDiscogsRecordDto,
} from './record.api.dto';
import { PaginationDto } from '../../Utility/global.types';

export interface IRecordController {
    createRecord(dto: CreateRecordDto): Promise<RecordPresentationDto>;
    createDiscogsRecord(
        dto: CreateDiscogsRecordDto
    ): Promise<RecordPresentationDto>;
    getRecords(
        paginationOptions: PaginationDto,
        sort: RecordSortDto,
        filter: RecordFilterDto
    ): Promise<RecordsPresentationsDto>;
    getRecordsList(
        paginationOptions: PaginationDto
    ): Promise<RecordsListPresentationDto>;
    updateRecord(recordId: number, dto: UpdateRecordDto): Promise<void>;
    deleteRecord(recordId: number): Promise<void>;
}

export interface IRecordApiMapper {
    recordToPresentation(dto: RecordDto): RecordPresentationDto;
    recordsToPresentation(dto: RecordsDto): RecordsPresentationsDto;
    recordListToPresentation(dto: RecordListDto): RecordListPresentationDto;
    recordsListToPresentation(dto: RecordsListDto): RecordsListPresentationDto;
}
