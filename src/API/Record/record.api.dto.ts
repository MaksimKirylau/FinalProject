import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator';
import type { Optional } from '../../Utility/global.types';

export class CreateRecordDto {
    @ApiProperty({ example: 'Record 1', description: 'Record title' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Author 1', description: 'Authors name' })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    authorName: string;

    @ApiProperty({
        example: 'Description 1',
        description: 'Record description',
    })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: '100', description: 'Record price' })
    @IsDefined()
    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @IsPositive()
    price: number;
}

export class CreateDiscogsRecordDto {
    @ApiProperty({ example: '1', description: 'Record id in discogs database' })
    @IsDefined()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    discogsId: number;

    @ApiProperty({
        example: 'Description 1',
        description: 'Record description',
    })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    description: string;
}

export class UpdateRecordDto {
    @ApiProperty({ example: 'name', description: 'Sort value' })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @ApiProperty({ example: 'Author 1', description: 'Authors name' })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    authorName?: string;

    @ApiProperty({
        example: 'Description 1',
        description: 'Record description',
    })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @ApiProperty({ example: '100', description: 'Record price' })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @IsPositive()
    price?: number;
}

export class RecordSortDto {
    @ApiProperty({ example: 'name', description: 'Sort value' })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    sortBy?: 'name' | 'authorName' | 'price';

    @ApiProperty({ example: 'ASC', description: 'Sort order' })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    sortOrder?: 'ASC' | 'DESC';
}

export class RecordFilterDto {
    @ApiProperty({ example: 'Author 1', description: 'Filter for records' })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    authorName?: string;
    @ApiProperty({ example: 'Record 1', description: 'Filter for records' })
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    name?: string;
}

export class RecordPresentationDto {
    @ApiProperty({ example: '1', description: 'Record id in database' })
    recordId: number;
    @ApiProperty({ example: 'Record 1', description: 'Record title' })
    name: string;
    @ApiProperty({ example: 'Author 1', description: 'Authors name' })
    authorName: string;
    @ApiProperty({
        example: 'Description 1',
        description: 'Record description',
    })
    description: string;
    @ApiProperty({ example: '100', description: 'Record price' })
    price: number;
}

export class RecordsPresentationsDto {
    @ApiProperty({
        example:
            '[{"recordId": 1, "name": "Record 1", "authorName": "Author 1", "description": "Description 1", "price": 100}]',
        description: 'Array of found records',
    })
    recordsPresentations: RecordPresentationDto[];
    @ApiProperty({ example: '1', description: 'Amount of found records' })
    recordsCount: number;
}

export class RecordListPresentationDto {
    @ApiProperty({ example: 'Record 1', description: 'Record title' })
    name: string;
    @ApiProperty({ example: 'Author 1', description: 'Authors name' })
    authorName: string;
    @ApiProperty({
        example: 'Description 1',
        description: 'Record description',
    })
    description: string;
    @ApiProperty({ example: '100', description: 'Record price' })
    price: number;

    @ApiProperty({
        example: 'Comment 1',
        description: 'Records first review comment',
    })
    comment: Optional<string>;
    @ApiProperty({ example: '3', description: 'Records first review score' })
    score: Optional<number>;

    @ApiProperty({ example: '3', description: 'Records average review score' })
    averageScore: Optional<number>;
}

export class RecordsListPresentationDto {
    @ApiProperty({
        example:
            '[{"name": "Record 1", "authorName": "Author 1", "description": "Description 1", "price": 100, "comment": "Comment 1", "score": 3, "averageScore": 3}]',
        description: 'Array of records',
    })
    recordsPresentation: RecordListPresentationDto[];
    @ApiProperty({ example: '1', description: 'Amount of found records' })
    recordsCount: number;
}
