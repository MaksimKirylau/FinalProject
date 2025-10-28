import {
    CreateDiscogsRecordDto,
    CreateRecordDto,
    RecordFilterDto,
    RecordListPresentationDto,
    RecordPresentationDto,
    RecordsListPresentationDto,
    RecordsPresentationsDto,
    RecordSortDto,
    UpdateRecordDto,
} from '../../../API/Record/record.api.dto';
import {
    RecordDto,
    RecordListDto,
    RecordsDto,
    RecordsEntitiesDto,
    RecordsListDto,
} from '../../../Domain/Record/record.dto';
import { RecordEntity } from '../../../Domain/Record/repository/record.repository.model';
import { PaginationDto } from '../../../Utility/global.types';
import { DiscogsReleaseDto } from '../../../Utility/services/Discogs/discogs.dto';

export const mockTelegramMessage: string = `
            *Record 1*
            Author 1
            100 $

            Description 1

            [Link to store](http://mock.com/database/1)
        `;

export const mockRecordPagination: PaginationDto = {
    page: 1,
    limit: 5,
};

export const mockRecordInvalidPagination: PaginationDto = {
    page: 1,
    limit: 100,
};

export const mockRecordSort: RecordSortDto = {
    sortBy: 'price',
    sortOrder: 'ASC',
};

export const mockRecordFilter: RecordFilterDto = {
    authorName: 'Author 1',
    name: 'Record 1',
};

export const mockNoRecordPagination: PaginationDto = {
    page: undefined,
    limit: undefined,
};

export const mockNoRecordSort: RecordSortDto = {
    sortBy: undefined,
    sortOrder: undefined,
};

export const mockNoRecordFilter: RecordFilterDto = {
    authorName: undefined,
    name: undefined,
};

export const MOCK_RECORD_ID: number = 1;
export const MOCK_NONEXISTENT_RECORD_ID: number = 999;
export const MOCK_DISCOGS_ID: number = 1;

export const mockCreateRecord: CreateRecordDto = {
    name: 'Record 1',
    authorName: 'Author 1',
    description: 'Description 1',
    price: 100,
};

export const mockCreateDiscogsRecord: CreateDiscogsRecordDto = {
    discogsId: 1,
    description: 'Description 1',
};

export const mockUpdateRecord: UpdateRecordDto = {
    name: 'Updated record name',
    authorName: 'Updated author name',
};

export const mockRecordPresentation: RecordPresentationDto = {
    recordId: 1,
    name: 'Record 1',
    authorName: 'Author 1',
    description: 'Description 1',
    price: 100,
};

export const mockRecordsPresentation: RecordsPresentationsDto = {
    recordsPresentations: [mockRecordPresentation],
    recordsCount: 1,
};

export const mockRecordListPresentation: RecordListPresentationDto = {
    name: 'Record 1',
    authorName: 'Author 1',
    description: 'Description 1',
    price: 100,
    comment: 'Comment 1',
    score: 3,
    averageScore: 4.6,
};

export const mockRecordsListPresentation: RecordsListPresentationDto = {
    recordsPresentation: [mockRecordListPresentation],
    recordsCount: 1,
};

export const mockRecord: RecordDto = {
    recordId: 1,
    discogsId: null,
    name: 'Record 1',
    authorName: 'Author 1',
    description: 'Description 1',
    price: 100,
    createdAt: '15.15.15',
    updatedAt: '16.16.16',
};

export const mockDiscogsRecord: RecordDto = {
    recordId: 1,
    discogsId: 1,
    name: 'Record 1',
    authorName: 'Author 1',
    description: 'Description 1',
    price: 100,
    createdAt: '15.15.15',
    updatedAt: '16.16.16',
};

export const mockRecords: RecordsDto = {
    records: [mockRecord],
    recordsCount: 1,
};

export const mockRecordList: RecordListDto = {
    recordId: 1,
    discogsId: null,
    name: 'Record 1',
    authorName: 'Author 1',
    description: 'Description 1',
    price: 100,
    reviewId: 1,
    comment: 'Comment 1',
    score: 3,
    averageScore: 4.6,
};

export const mockRecordsList: RecordsListDto = {
    records: [mockRecordList],
    recordsCount: 1,
};

export const mockRecordEntity: RecordEntity = {
    dataValues: {
        recordId: 1,
        name: 'Record 1',
        authorName: 'Author 1',
        description: 'Description 1',
        price: 100,
        createdAt: '15.15.15',
        updatedAt: '16.16.16',
    },
} as RecordEntity;

export const mockRecordsEntities: RecordsEntitiesDto = {
    rows: [mockRecordEntity],
    count: 1,
};

export const mockDiscogsRelease: DiscogsReleaseDto = {
    id: 1,
    title: 'Record 1',
    artists: 'Author 1',
    price: 100,
};
