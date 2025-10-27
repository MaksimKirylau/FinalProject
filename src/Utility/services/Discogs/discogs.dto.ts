import { ApiProperty } from '@nestjs/swagger';

export class DiscogsRelease {
    id: number;
    title: string;
    artists?: { name: string }[];
    year?: string;
    genres?: string[];
    styles?: string[];
    tracklist?: { title: string }[];
    notes?: string;
}

export class DiscogsSearchResponse {
    results: DiscogsRelease[];
    pagination: {
        items: number;
        page: number;
        pages: number;
    };
}

export class DiscogsReleaseDto {
    id: number;
    title: string;
    artists: string;
    price: number;
}

export class DiscogsScoreDto {
    @ApiProperty({
        example: '2.5',
        description: 'Average review score from discogs',
    })
    average: number;
    @ApiProperty({
        example: '10',
        description: 'Users number, who left review',
    })
    count: number;
}
