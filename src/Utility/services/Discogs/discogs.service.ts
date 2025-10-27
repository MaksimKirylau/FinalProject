import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceException } from '../../../Utility/errors/appExceptions/appException';
import {
    DiscogsRelease,
    DiscogsReleaseDto,
    DiscogsScoreDto,
} from './discogs.dto';
import { DISCOGS_MAPPERS } from './discogs.constants';
import type { IDiscogsMappers, IDiscogsService } from './discogs.interfaces';

@Injectable()
export class DiscogsService implements IDiscogsService {
    private discogsUrl: string;
    private discogsToken: string;

    constructor(
        @Inject(DISCOGS_MAPPERS)
        private readonly discogsMappers: IDiscogsMappers,
        private readonly configService: ConfigService
    ) {
        this.discogsUrl = this.configService.get<string>('DISCOGS_API_URL')!;
        this.discogsToken =
            this.configService.get<string>('DISCOGS_API_TOKEN')!;
    }

    private getAuthHeaders() {
        return {
            'User-Agent': 'CourseFinalProject/1.0',
            Authorization: `Discogs token=${this.discogsToken}`,
        };
    }

    private async fetchJson<T>(
        url: string,
        params?: Record<string, any>
    ): Promise<T> {
        try {
            const query = params
                ? '?' +
                  new URLSearchParams(
                      params as Record<string, string>
                  ).toString()
                : '';

            const response = await fetch(`${url}${query}`, {
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status} - ${response.statusText}`
                );
            }

            return (await response.json()) as T;
        } catch (error) {
            throw new ServiceException(
                'Discogs API request failed',
                error.message
            );
        }
    }

    async getReleaseDetails(releaseId: number): Promise<DiscogsReleaseDto> {
        const data = await this.fetchJson<DiscogsRelease>(
            `${this.discogsUrl}/releases/${releaseId}?USD`
        );
        return this.discogsMappers.discogsResleaseToRelease(data);
    }

    async getReleaseScore(releaseId: number): Promise<DiscogsScoreDto> {
        const data = await this.fetchJson(
            `${this.discogsUrl}/releases/${releaseId}/rating`
        );
        return this.discogsMappers.discogsScoreToScore(data);
    }
}
