import { Injectable } from '@nestjs/common';
import { DiscogsReleaseDto, DiscogsScoreDto } from './discogs.dto';
import { IDiscogsMappers } from './discogs.interfaces';

@Injectable()
export class DiscogsMappers implements IDiscogsMappers {
    discogsResleaseToRelease(dto): DiscogsReleaseDto {
        return {
            id: dto.id,
            title: dto.title,
            artists: dto.artists_sort,
            price: dto.lowest_price,
        };
    }

    discogsScoreToScore(dto): DiscogsScoreDto {
        return {
            count: dto.rating.count,
            average: dto.rating.average,
        };
    }
}
