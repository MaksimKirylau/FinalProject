import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export type Optional<T> = T | null;

export type Role = 'admin' | 'customer';

export class PaginationDto {
    @ApiProperty({ example: '1', description: 'Page number' })
    @Transform(({ value }) => parseInt(value))
    page?: number;

    @ApiProperty({ example: '10', description: 'Amount of entriest for page' })
    @Transform(({ value }) => parseInt(value))
    limit?: number;
}
