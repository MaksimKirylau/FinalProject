import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PoliciesGuard } from '../../Auth/authorization/guards/casl.guard';
import type {
    IRecordApiMapper,
    IRecordController,
} from './record.api.interfaces';
import {
    CreateDiscogsRecordDto,
    CreateRecordDto,
    RecordFilterDto,
    RecordPresentationDto,
    RecordsListPresentationDto,
    RecordsPresentationsDto,
    RecordSortDto,
    UpdateRecordDto,
} from './record.api.dto';
import { RECORD_API_MAPPER } from './record.api.constants';
import { RECORD_SERVICE } from '../../Domain/Record/record.constants';
import type { IRecordService } from '../../Domain/Record/record.interfaces';
import {
    RecordDto,
    RecordsDto,
    RecordsListDto,
} from '../../Domain/Record/record.dto';
import { CheckAbilities } from '../../Utility/decorators/casl.decorator';
import { Action } from '../../Auth/authorization/casl-ability.factory';
import { Public } from '../../Utility/decorators/public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from '../../Utility/global.types';

@Controller('record')
@UseGuards(PoliciesGuard)
export class RecordController implements IRecordController {
    constructor(
        @Inject(RECORD_SERVICE) private readonly recordService: IRecordService,
        @Inject(RECORD_API_MAPPER)
        private readonly recordApiMapper: IRecordApiMapper
    ) {}

    @ApiOperation({ summary: 'Search record by id in databse' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns found record',
        type: RecordPresentationDto,
    })
    @CheckAbilities({ action: Action.Read, subject: RecordDto })
    @Get('/database/:id')
    public async getRecord(
        @Param('id', ParseIntPipe) recordId: number
    ): Promise<RecordPresentationDto> {
        const record: RecordDto = await this.recordService.getRecord(recordId);

        const recordPresentation: RecordPresentationDto =
            this.recordApiMapper.recordToPresentation(record);
        return recordPresentation;
    }

    @ApiOperation({ summary: 'Search for specific records' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns found records',
        type: RecordsPresentationsDto,
    })
    @CheckAbilities({ action: Action.Read, subject: RecordDto })
    @Get('/search/')
    public async getRecords(
        @Query('pagination') pagination: PaginationDto,
        @Query('sort') sort: RecordSortDto,
        @Query('filter') filter: RecordFilterDto
    ): Promise<RecordsPresentationsDto> {
        const records: RecordsDto = await this.recordService.getRecords(
            pagination,
            sort,
            filter
        );
        const recordsPresentation: RecordsPresentationsDto =
            this.recordApiMapper.recordsToPresentation(records);
        return recordsPresentation;
    }

    @ApiOperation({
        summary: 'Search specific record and publish it to telegram',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns found record',
        type: RecordPresentationDto,
    })
    @CheckAbilities({ action: Action.Manage, subject: RecordDto })
    @Get('/telegram/:id')
    public async publishToTelegram(
        @Param('id', ParseIntPipe) recordId: number
    ): Promise<void> {
        const record: RecordDto = await this.recordService.getRecord(recordId);
        await this.recordService.publishRecord(record);
    }

    @ApiOperation({ summary: 'Records list for unauthentificated users' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns records list with first review and average score',
        type: RecordsListPresentationDto,
    })
    @Public()
    @Get('/list/')
    public async getRecordsList(
        @Query() pagination: PaginationDto
    ): Promise<RecordsListPresentationDto> {
        const recordsList: RecordsListDto =
            await this.recordService.getRecordsList(pagination);
        const recordsListPresentation: RecordsListPresentationDto =
            this.recordApiMapper.recordsListToPresentation(recordsList);
        return recordsListPresentation;
    }

    @ApiOperation({
        summary: 'Endpoint to create new record for. Only for admin',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Returns created record',
        type: RecordPresentationDto,
    })
    @CheckAbilities({ action: Action.Create, subject: RecordDto })
    @Post('/add')
    public async createRecord(
        @Body() dto: CreateRecordDto
    ): Promise<RecordPresentationDto> {
        const record: RecordDto = await this.recordService.createRecord(dto);
        const recordPresentation: RecordPresentationDto =
            this.recordApiMapper.recordToPresentation(record);
        return recordPresentation;
    }

    @ApiOperation({
        summary:
            'Endpoint to create record with info from discogs. Only for admin',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Returns created record',
        type: RecordPresentationDto,
    })
    @CheckAbilities({ action: Action.Create, subject: RecordDto })
    @Post('/discogs/add')
    public async createDiscogsRecord(
        @Body() dto: CreateDiscogsRecordDto
    ): Promise<RecordPresentationDto> {
        const record: RecordDto =
            await this.recordService.createDiscogsRecord(dto);
        const recordPresentation: RecordPresentationDto =
            this.recordApiMapper.recordToPresentation(record);
        return recordPresentation;
    }

    @ApiOperation({ summary: 'Updates record. Only for admin' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns 200 code upon successful update',
    })
    @CheckAbilities({ action: Action.Update, subject: RecordDto })
    @Put('/update/:id')
    public async updateRecord(
        @Param('id', ParseIntPipe) recordId: number,
        @Body() dto: UpdateRecordDto
    ): Promise<void> {
        await this.recordService.updateRecord(recordId, dto);
    }

    @ApiOperation({ summary: 'Deletes record. Only for admin' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns 200 code upon successful delete',
    })
    @CheckAbilities({ action: Action.Delete, subject: RecordDto })
    @Delete('/delete/:id')
    public async deleteRecord(
        @Param('id', ParseIntPipe) recordId: number
    ): Promise<void> {
        await this.recordService.deleteRecord(recordId);
    }
}
