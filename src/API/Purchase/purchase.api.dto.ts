import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePurchaseDto {
    @IsDefined()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    userId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    recordId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    sessionId: string;
}

export class PurchasePresentationDto {
    @ApiProperty({ example: '1', description: 'Purchase id in database' })
    purchaseId: number;

    @ApiProperty({ example: 'paid', description: 'Purchase status' })
    status: 'pending' | 'paid' | 'failed';
}
