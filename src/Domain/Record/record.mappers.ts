import { Injectable } from '@nestjs/common';
import { IRecordMappers } from './record.interfaces';
import { RecordEntity } from './repository/record.repository.model';
import { RecordDto, RecordsDto, RecordsEntitiesDto } from './record.dto';

@Injectable()
export class RecordMappers implements IRecordMappers {
    public recordEntityToRecord(dto: RecordEntity): RecordDto {
        return {
            recordId: dto.dataValues.recordId,
            discogsId: dto.dataValues.discogsId,
            name: dto.dataValues.name,
            authorName: dto.dataValues.authorName,
            description: dto.dataValues.description,
            price: dto.dataValues.price,
            createdAt: dto.dataValues.createdAt,
            updatedAt: dto.dataValues.updatedAt,
        };
    }

    public recordsEntitiesToRecords(dto: RecordsEntitiesDto): RecordsDto {
        return {
            records: dto.rows.map((recordEntity) =>
                this.recordEntityToRecord(recordEntity)
            ),
            recordsCount: dto.count,
        };
    }
}
