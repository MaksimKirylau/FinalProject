import { Module } from '@nestjs/common';
import { FILE_SERVICE } from './file.constants';
import { FileService } from './file.service';

@Module({
    providers: [{ provide: FILE_SERVICE, useClass: FileService }],
    imports: [],
    exports: [FILE_SERVICE],
})
export class FileModule {}
