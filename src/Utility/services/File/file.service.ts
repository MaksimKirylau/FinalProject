import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IFileService } from './file.interfaces';
import fs from 'fs';
import path from 'path';
import uuid from 'uuid';

@Injectable()
export class FileService implements IFileService {
    constructor() {}

    public async createFile(file): Promise<string> {
        try {
            const fileName: string = uuid.v4() + '.jpg';
            const filePath: string = path.resolve(process.cwd(), 'files');

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }

            fs.writeFileSync(path.join(filePath, fileName), file.buffer);

            return fileName;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
