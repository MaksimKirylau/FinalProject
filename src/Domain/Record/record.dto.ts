import { Optional } from '../../Utility/global.types';
import { RecordEntity } from './repository/record.repository.model';

export class RecordDto {
    recordId: number;
    discogsId: Optional<number>;
    name: string;
    authorName: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export class RecordsDto {
    records: RecordDto[];
    recordsCount: number;
}

export class RecordsEntitiesDto {
    rows: RecordEntity[];
    count: number;
}

export interface RecordListDto {
    recordId: number;
    discogsId: Optional<number>;
    name: string;
    authorName: string;
    description: string;
    price: number;

    reviewId: Optional<number>;
    comment: Optional<string>;
    score: Optional<number>;

    averageScore: Optional<number>;
}

export interface RecordsListDto {
    records: RecordListDto[];
    recordsCount: number;
}
