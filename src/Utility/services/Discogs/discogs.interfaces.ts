import { DiscogsReleaseDto, DiscogsScoreDto } from './discogs.dto';

export interface IDiscogsService {
    getReleaseDetails(releaseId: number): Promise<DiscogsReleaseDto>;
    getReleaseScore(releaseId: number): Promise<DiscogsScoreDto>;
}

export interface IDiscogsMappers {
    discogsResleaseToRelease(dto): DiscogsReleaseDto;
    discogsScoreToScore(dto): DiscogsScoreDto;
}
