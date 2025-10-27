import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { RecordController } from '../../../API/Record/record.controller';
import {
    MOCK_RECORD_ID,
    mockCreateDiscogsRecord,
    mockCreateRecord,
    mockDiscogsRecord,
    mockNoRecordFilter,
    mockNoRecordPagination,
    mockNoRecordSort,
    mockRecord,
    mockRecordFilter,
    mockRecordPagination,
    mockRecordPresentation,
    mockRecords,
    mockRecordsList,
    mockRecordsListPresentation,
    mockRecordSort,
    mockRecordsPresentation,
    mockUpdateRecord,
} from './record.mock';

describe('RecordController', () => {
    let recordController: RecordController;
    let mockRecordService;
    let mockRecordApiMapper;

    beforeEach(() => {
        mock.reset();

        mockRecordService = {
            getRecord: mock.fn(),
            getRecords: mock.fn(),
            getRecordsList: mock.fn(),
            createRecord: mock.fn(),
            createDiscogsRecord: mock.fn(),
            updateRecord: mock.fn(),
            deleteRecord: mock.fn(),
        };

        mockRecordApiMapper = {
            recordsToPresentation: mock.fn(),
            recordToPresentation: mock.fn(),
            recordListToPresentation: mock.fn(),
            recordsListToPresentation: mock.fn(),
        };

        recordController = new RecordController(
            mockRecordService,
            mockRecordApiMapper
        );
    });

    describe('getRecords', () => {
        it('should return mapped records with pagination, sort and filter', async () => {
            mockRecordService.getRecords.mock.mockImplementation(() =>
                Promise.resolve(mockRecords)
            );
            mockRecordApiMapper.recordsToPresentation.mock.mockImplementation(
                () => mockRecordsPresentation
            );

            const result = await recordController.getRecords(
                mockRecordPagination,
                mockRecordSort,
                mockRecordFilter
            );

            assert.deepEqual(
                mockRecordService.getRecords.mock.calls[0].arguments,
                [mockRecordPagination, mockRecordSort, mockRecordFilter]
            );
            assert.deepEqual(
                mockRecordApiMapper.recordsToPresentation.mock.calls[0]
                    .arguments,
                [mockRecords]
            );
            assert.deepEqual(result, mockRecordsPresentation);
        });

        it('should handle empty options', async () => {
            mockRecordService.getRecords.mock.mockImplementation(() =>
                Promise.resolve(mockRecords)
            );
            mockRecordApiMapper.recordsToPresentation.mock.mockImplementation(
                () => mockRecordsPresentation
            );

            const result = await recordController.getRecords(
                mockNoRecordPagination,
                mockNoRecordSort,
                mockNoRecordFilter
            );

            assert.deepEqual(result, mockRecordsPresentation);
        });
    });

    describe('getRecordsList', () => {
        it('should return mapped records list with pagination', async () => {
            mockRecordService.getRecordsList.mock.mockImplementation(() =>
                Promise.resolve(mockRecordsList)
            );
            mockRecordApiMapper.recordsListToPresentation.mock.mockImplementation(
                () => mockRecordsListPresentation
            );

            const result =
                await recordController.getRecordsList(mockRecordPagination);

            assert.deepEqual(
                mockRecordService.getRecordsList.mock.calls[0].arguments,
                [mockRecordPagination]
            );
            assert.deepEqual(
                mockRecordApiMapper.recordsListToPresentation.mock.calls[0]
                    .arguments,
                [mockRecordsList]
            );
            assert.deepEqual(result, mockRecordsListPresentation);
        });

        it('should handle empty pagination', async () => {
            mockRecordService.getRecordsList.mock.mockImplementation(() =>
                Promise.resolve(mockRecordsList)
            );
            mockRecordApiMapper.recordsListToPresentation.mock.mockImplementation(
                () => mockRecordsListPresentation
            );

            const result = await recordController.getRecordsList(
                mockNoRecordPagination
            );

            assert.deepEqual(result, mockRecordsListPresentation);
        });
    });

    describe('createRecord', () => {
        it('should create and return mapped record', async () => {
            mockRecordService.createRecord.mock.mockImplementation(() =>
                Promise.resolve(mockRecord)
            );
            mockRecordApiMapper.recordToPresentation.mock.mockImplementation(
                () => mockRecordPresentation
            );

            const result =
                await recordController.createRecord(mockCreateRecord);

            assert.deepEqual(
                mockRecordService.createRecord.mock.calls[0].arguments,
                [mockCreateRecord]
            );
            assert.deepEqual(
                mockRecordApiMapper.recordToPresentation.mock.calls[0]
                    .arguments,
                [mockRecord]
            );
            assert.deepEqual(result, mockRecordPresentation);
        });
    });

    describe('createDiscogsRecord', () => {
        it('should create and return mapped discogs record', async () => {
            mockRecordService.createDiscogsRecord.mock.mockImplementation(() =>
                Promise.resolve(mockDiscogsRecord)
            );
            mockRecordApiMapper.recordToPresentation.mock.mockImplementation(
                () => mockRecordPresentation
            );

            const result = await recordController.createDiscogsRecord(
                mockCreateDiscogsRecord
            );

            assert.deepEqual(
                mockRecordService.createDiscogsRecord.mock.calls[0].arguments,
                [mockCreateDiscogsRecord]
            );
            assert.deepEqual(
                mockRecordApiMapper.recordToPresentation.mock.calls[0]
                    .arguments,
                [mockDiscogsRecord]
            );
            assert.deepEqual(result, mockRecordPresentation);
        });
    });

    describe('updateRecord', () => {
        it('should update record with correct ID from param and body data', async () => {
            mockRecordService.updateRecord.mock.mockImplementation(() =>
                Promise.resolve()
            );

            await recordController.updateRecord(
                MOCK_RECORD_ID,
                mockUpdateRecord
            );

            assert.deepEqual(
                mockRecordService.updateRecord.mock.calls[0].arguments,
                [MOCK_RECORD_ID, mockUpdateRecord]
            );
        });
    });

    describe('deleteRecord', () => {
        it('should delete record with correct ID from param', async () => {
            mockRecordService.deleteRecord.mock.mockImplementation(() =>
                Promise.resolve()
            );

            await recordController.deleteRecord(MOCK_RECORD_ID);

            assert.deepEqual(
                mockRecordService.deleteRecord.mock.calls[0].arguments,
                [MOCK_RECORD_ID]
            );
        });
    });
});
