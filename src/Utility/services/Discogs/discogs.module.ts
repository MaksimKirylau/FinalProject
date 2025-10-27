import { Module } from '@nestjs/common';
import { DISCOGS_MAPPERS, DISCOGS_SERVICE } from './discogs.constants';
import { DiscogsService } from './discogs.service';
import { DiscogsMappers } from './discogs.mappers';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [
        { provide: DISCOGS_SERVICE, useClass: DiscogsService },
        { provide: DISCOGS_MAPPERS, useClass: DiscogsMappers },
    ],
    exports: [DISCOGS_SERVICE],
})
export class DiscogsModule {}
