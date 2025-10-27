import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { QueryTypes } from 'sequelize';
import { RecordRepository } from '../../../Domain/Record/repository/records.repository';
import {
    MOCK_NONEXISTENT_RECORD_ID,
    MOCK_RECORD_ID,
    mockCreateRecord,
    mockRecord,
    mockRecordsEntities,
    mockRecordEntity,
    mockRecords,
    mockUpdateRecord,
    mockRecordPagination,
    mockRecordSort,
    mockRecordFilter,
    mockNoRecordPagination,
    mockNoRecordSort,
    mockNoRecordFilter,
    mockRecordInvalidPagination,
    mockRecordList,
    mockRecordsList,
} from './record.mock';
import {
    DEFAULT_LIMIT,
    DEFAULT_PAGE,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_ORDER,
} from '../../../Domain/Record/record.constants';

describe('RecordRepository', () => {
    let recordRepository: RecordRepository;
    let mockRecordDb;
    let mockRecordMappers;
    let mockSequelize;

    beforeEach(() => {
        mock.reset();

        mockRecordDb = {
            create: mock.fn(),
            update: mock.fn(),
            findOne: mock.fn(),
            findAndCountAll: mock.fn(),
            destroy: mock.fn(),
        };

        mockRecordMappers = {
            recordEntityToRecord: mock.fn(),
            recordsEntitiesToRecords: mock.fn(),
        };

        mockSequelize = {
            query: mock.fn(),
        };

        recordRepository = new RecordRepository(
            mockRecordDb,
            mockRecordMappers,
            mockSequelize
        );
    });

    describe('createRecord', () => {
        it('should create and return mapped record', async () => {
            mockRecordDb.create.mock.mockImplementation(() =>
                Promise.resolve(mockRecordEntity)
            );
            mockRecordMappers.recordEntityToRecord.mock.mockImplementation(
                () => mockRecord
            );

            const result =
                await recordRepository.createRecord(mockCreateRecord);

            assert.deepStrictEqual(
                mockRecordDb.create.mock.calls[0].arguments,
                [mockCreateRecord]
            );
            assert.deepStrictEqual(
                mockRecordMappers.recordEntityToRecord.mock.calls[0].arguments,
                [mockRecordEntity]
            );
            assert.deepEqual(result, mockRecord);
        });
    });

    describe('updateRecord', () => {
        it('should update record with correct ID and data', async () => {
            await recordRepository.updateRecord(
                MOCK_RECORD_ID,
                mockUpdateRecord
            );

            assert.deepStrictEqual(
                mockRecordDb.update.mock.calls[0].arguments,
                [mockUpdateRecord, { where: { recordId: MOCK_RECORD_ID } }]
            );
        });
    });

    describe('findRecord', () => {
        it('should return mapped record when found', async () => {
            mockRecordDb.findOne.mock.mockImplementation(() =>
                Promise.resolve(mockRecordEntity)
            );
            mockRecordMappers.recordEntityToRecord.mock.mockImplementation(
                () => mockRecord
            );

            const result = await recordRepository.findRecord({
                recordId: MOCK_RECORD_ID,
            });

            assert.deepStrictEqual(
                mockRecordDb.findOne.mock.calls[0].arguments,
                [{ where: { recordId: MOCK_RECORD_ID } }]
            );
            assert.deepEqual(result, mockRecord);
        });

        it('should return null when record not found', async () => {
            mockRecordDb.findOne.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            const result = await recordRepository.findRecord({
                recordId: MOCK_NONEXISTENT_RECORD_ID,
            });

            assert.equal(result, null);
        });
    });

    describe('findRecords', () => {
        it('should return mapped records with default pagination and sorting', async () => {
            mockRecordDb.findAndCountAll.mock.mockImplementation(() =>
                Promise.resolve(mockRecordsEntities)
            );
            mockRecordMappers.recordsEntitiesToRecords.mock.mockImplementation(
                () => mockRecords
            );

            const result = await recordRepository.findRecords(
                mockNoRecordPagination,
                mockNoRecordSort,
                mockNoRecordFilter
            );

            assert.deepStrictEqual(
                mockRecordDb.findAndCountAll.mock.calls[0].arguments,
                [
                    {
                        where: {},
                        order: [[DEFAULT_SORT_BY, DEFAULT_SORT_ORDER]],
                        limit: DEFAULT_LIMIT,
                        offset: (DEFAULT_PAGE - 1) * DEFAULT_LIMIT,
                    },
                ]
            );

            assert.deepEqual(result, mockRecords);
        });

        it('should apply custom pagination, sorting and filters', async () => {
            mockRecordDb.findAndCountAll.mock.mockImplementation(() =>
                Promise.resolve(mockRecordsEntities)
            );
            mockRecordMappers.recordsEntitiesToRecords.mock.mockImplementation(
                () => mockRecords
            );

            const result = await recordRepository.findRecords(
                mockRecordPagination,
                mockRecordSort,
                mockRecordFilter
            );

            assert.deepStrictEqual(
                mockRecordDb.findAndCountAll.mock.calls[0].arguments,
                [
                    {
                        where: mockRecordFilter,
                        order: [
                            [mockRecordSort.sortBy, mockRecordSort.sortOrder],
                        ],
                        limit: mockRecordPagination.limit,
                        offset:
                            (mockRecordPagination.page! - 1) *
                            mockRecordPagination.limit!,
                    },
                ]
            );

            assert.deepEqual(result, mockRecords);
        });

        it('should limit maximum limit size to DEFAULT_LIMIT', async () => {
            mockRecordDb.findAndCountAll.mock.mockImplementation(() =>
                Promise.resolve(mockRecordsEntities)
            );
            mockRecordMappers.recordsEntitiesToRecords.mock.mockImplementation(
                () => mockRecords
            );

            await recordRepository.findRecords(
                mockRecordInvalidPagination,
                mockRecordSort,
                mockRecordFilter
            );

            assert.deepEqual(
                mockRecordDb.findAndCountAll.mock.calls[0].arguments[0].limit,
                DEFAULT_LIMIT
            );
        });
    });

    describe('findRecordsList', () => {
        it('should return records list with pagination', async () => {
            mockSequelize.query.mock.mockImplementationOnce(
                () => Promise.resolve([{ count: 1 }]),
                0
            ); //first call for count
            mockSequelize.query.mock.mockImplementationOnce(
                () => Promise.resolve([mockRecordList]),
                1
            ); //second call for data

            const result =
                await recordRepository.findRecordsList(mockRecordPagination);

            assert.deepEqual(mockSequelize.query.mock.calls[1].arguments[1], {
                type: QueryTypes.SELECT,
                replacements: {
                    limit: mockRecordPagination.limit,
                    offset:
                        (mockRecordPagination.page! - 1) *
                        mockRecordPagination.limit!,
                },
            });

            assert.deepEqual(result, mockRecordsList);
        });

        it('should limit maximum page size to DEFAULT_LIMIT', async () => {
            mockSequelize.query.mock.mockImplementationOnce(
                () => Promise.resolve([{ count: 1 }]),
                0
            );
            mockSequelize.query.mock.mockImplementationOnce(
                () => Promise.resolve([mockRecordList]),
                1
            );

            await recordRepository.findRecordsList(mockRecordInvalidPagination);

            assert.deepEqual(mockSequelize.query.mock.calls[1].arguments[1], {
                type: QueryTypes.SELECT,
                replacements: {
                    limit: DEFAULT_LIMIT,
                    offset: (mockRecordPagination.page! - 1) * DEFAULT_LIMIT,
                },
            });
        });
    });

    describe('destroyRecord', () => {
        it('should destroy record with correct ID', async () => {
            await recordRepository.destroyRecord(MOCK_RECORD_ID);

            assert.deepEqual(mockRecordDb.destroy.mock.calls[0].arguments, [
                { where: { recordId: MOCK_RECORD_ID } },
            ]);
        });
    });
});
