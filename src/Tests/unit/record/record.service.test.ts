import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import {
    MOCK_NONEXISTENT_RECORD_ID,
    MOCK_RECORD_ID,
    mockCreateRecord,
    mockRecordFilter,
    mockRecordPagination,
    mockRecord,
    mockRecords,
    mockRecordsList,
    mockRecordSort,
    mockUpdateRecord,
    mockDiscogsRecord,
    mockDiscogsRelease,
    mockCreateDiscogsRecord,
    MOCK_DISCOGS_ID,
} from './record.mock';
import {
    ResourceNotFoundException,
    ValidationException,
} from '../../../Utility/errors/appExceptions/appException';
import { RecordService } from '../../../Domain/Record/record.service';

describe('RecordService', () => {
    let recordService: RecordService;
    let mockRecordRepository;
    let mockDiscogsService;

    beforeEach(() => {
        mock.reset();

        mockRecordRepository = {
            findRecord: mock.fn(),
            findRecords: mock.fn(),
            findRecordsList: mock.fn(),
            createRecord: mock.fn(),
            updateRecord: mock.fn(),
            destroyRecord: mock.fn(),
        };

        mockDiscogsService = {
            getReleaseDetails: mock.fn(),
            getReleaseScore: mock.fn(),
        };

        recordService = new RecordService(
            mockRecordRepository,
            mockDiscogsService
        );
    });

    describe('getRecord', () => {
        it('should return record when found', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );

            const result = await recordService.getRecord(MOCK_RECORD_ID);

            assert.deepEqual(
                mockRecordRepository.findRecord.mock.calls[0].arguments,
                [{ recordId: MOCK_RECORD_ID }]
            );
            assert.deepEqual(result, mockRecord);
        });

        it('should throw ResourceNotFoundException when record not found', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() => null);

            await assert.rejects(
                () => recordService.getRecord(MOCK_NONEXISTENT_RECORD_ID),
                (error) => {
                    assert.ok(error instanceof ResourceNotFoundException);
                    assert.strictEqual(
                        error.message,
                        `record with identifier ${MOCK_NONEXISTENT_RECORD_ID} not found`
                    );
                    return true;
                }
            );
        });
    });

    describe('getRecords', () => {
        it('should return records with pagination, sort and filter', async () => {
            mockRecordRepository.findRecords.mock.mockImplementation(() =>
                Promise.resolve(mockRecords)
            );

            const result = await recordService.getRecords(
                mockRecordPagination,
                mockRecordSort,
                mockRecordFilter
            );

            assert.deepEqual(
                mockRecordRepository.findRecords.mock.calls[0].arguments,
                [mockRecordPagination, mockRecordSort, mockRecordFilter]
            );
            assert.deepEqual(result, mockRecords);
        });
    });

    describe('getRecordsList', () => {
        it('should return records list with pagination', async () => {
            mockRecordRepository.findRecordsList.mock.mockImplementation(() =>
                Promise.resolve(mockRecordsList)
            );

            const result =
                await recordService.getRecordsList(mockRecordPagination);

            assert.deepEqual(
                mockRecordRepository.findRecordsList.mock.calls[0].arguments,
                [mockRecordPagination]
            );
            assert.deepEqual(result, mockRecordsList);
        });
    });

    describe('createRecord', () => {
        it('should create new record when name is unique', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(null)
            );
            mockRecordRepository.createRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );

            const result = await recordService.createRecord(mockCreateRecord);

            assert.deepEqual(
                mockRecordRepository.findRecord.mock.calls[0].arguments,
                [
                    {
                        name: mockCreateRecord.name,
                        authorName: mockCreateRecord.authorName,
                    },
                ]
            );
            assert.deepEqual(
                mockRecordRepository.createRecord.mock.calls[0].arguments,
                [mockCreateRecord]
            );
            assert.deepEqual(result, mockRecord);
        });

        it('should throw ValidationException when record already exists', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );

            await assert.rejects(
                () => recordService.createRecord(mockCreateRecord),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(
                        error.message,
                        'Record with this name/author already exists'
                    );
                    assert.strictEqual(error.details, mockCreateRecord.name);
                    return true;
                }
            );
        });
    });

    describe('updateRecord', () => {
        it('should update existing record', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );

            await recordService.updateRecord(MOCK_RECORD_ID, mockUpdateRecord);

            assert.deepEqual(
                mockRecordRepository.updateRecord.mock.calls[0].arguments,
                [MOCK_RECORD_ID, mockUpdateRecord]
            );
        });

        it('should throw ResourceNotFoundException when updating non-existent record', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() => null);

            await assert.rejects(
                () =>
                    recordService.updateRecord(
                        MOCK_NONEXISTENT_RECORD_ID,
                        mockUpdateRecord
                    ),
                (error) => {
                    assert.ok(error instanceof ResourceNotFoundException);
                    assert.strictEqual(
                        error.message,
                        `record with identifier ${MOCK_NONEXISTENT_RECORD_ID} not found`
                    );
                    return true;
                }
            );
        });

        it('should throw ValidationException for empty DTO', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );

            await assert.rejects(
                () => recordService.updateRecord(MOCK_RECORD_ID, {}),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(
                        error.message,
                        'No updates to implement'
                    );
                    return true;
                }
            );
        });
    });

    describe('deleteRecord', () => {
        it('should delete existing record', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );

            await recordService.deleteRecord(MOCK_RECORD_ID);

            assert.deepEqual(
                mockRecordRepository.destroyRecord.mock.calls[0].arguments,
                [MOCK_RECORD_ID]
            );
        });

        it('should throw ResourceNotFoundException when deleting non-existent record', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(null)
            );

            await assert.rejects(
                () => recordService.deleteRecord(MOCK_NONEXISTENT_RECORD_ID),
                (error) => {
                    assert.ok(error instanceof ResourceNotFoundException);
                    assert.strictEqual(
                        error.message,
                        `record with identifier ${MOCK_NONEXISTENT_RECORD_ID} not found`
                    );
                    return true;
                }
            );
        });
    });

    describe('createDiscogsRecord', () => {
        it('should create new discogs record', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(null)
            );
            mockDiscogsService.getReleaseDetails.mock.mockImplementation(() =>
                Promise.resolve(mockDiscogsRelease)
            );
            mockRecordRepository.createRecord.mock.mockImplementation(() =>
                Promise.resolve(mockDiscogsRecord)
            );

            const result = await recordService.createDiscogsRecord(
                mockCreateDiscogsRecord
            );

            assert.deepEqual(
                mockRecordRepository.findRecord.mock.calls[0].arguments,
                [{ discogsId: mockCreateDiscogsRecord.discogsId }]
            );
            assert.deepEqual(
                mockDiscogsService.getReleaseDetails.mock.calls[0].arguments,
                [MOCK_DISCOGS_ID]
            );
            assert.deepEqual(
                mockRecordRepository.createRecord.mock.calls[0].arguments,
                [
                    {
                        name: mockDiscogsRelease.title,
                        authorName: mockDiscogsRelease.artists,
                        price: mockDiscogsRelease.price,
                        ...mockCreateDiscogsRecord,
                    },
                ]
            );
            assert.deepEqual(result, mockDiscogsRecord);
        });

        it('should throw ValidationException when record with same discogsId already exists', async () => {
            mockRecordRepository.findRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );

            await assert.rejects(
                () =>
                    recordService.createDiscogsRecord(mockCreateDiscogsRecord),
                (error) => {
                    assert.ok(error instanceof ValidationException);
                    assert.strictEqual(
                        error.message,
                        'Record with this discogs id already exists'
                    );
                    assert.strictEqual(
                        error.details,
                        mockCreateDiscogsRecord.discogsId
                    );
                    return true;
                }
            );
        });
    });
});
