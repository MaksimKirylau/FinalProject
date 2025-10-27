import { Injectable } from '@nestjs/common';
import { IRecordApiMapper } from './record.api.interfaces';
import {
    RecordDto,
    RecordListDto,
    RecordsDto,
    RecordsListDto,
} from '../../Domain/Record/record.dto';
import {
    RecordListPresentationDto,
    RecordPresentationDto,
    RecordsListPresentationDto,
    RecordsPresentationsDto,
} from './record.api.dto';

@Injectable()
export class RecordApiMapper implements IRecordApiMapper {
    public recordToPresentation(dto: RecordDto): RecordPresentationDto {
        return {
            recordId: dto.recordId,
            name: dto.name,
            authorName: dto.authorName,
            description: dto.description,
            price: dto.price,
        };
    }

    public recordsToPresentation(dto: RecordsDto): RecordsPresentationsDto {
        return {
            recordsPresentations: dto.records.map((record) =>
                this.recordToPresentation(record)
            ),
            recordsCount: dto.recordsCount,
        };
    }

    public recordListToPresentation(
        dto: RecordListDto
    ): RecordListPresentationDto {
        return {
            name: dto.name,
            authorName: dto.authorName,
            description: dto.description,
            price: dto.price,
            comment: dto.comment,
            score: dto.score,

            averageScore: dto.averageScore,
        };
    }

    public recordsListToPresentation(
        dto: RecordsListDto
    ): RecordsListPresentationDto {
        return {
            recordsPresentation: dto.records.map((record) =>
                this.recordListToPresentation(record)
            ),
            recordsCount: dto.recordsCount,
        };
    }
}
