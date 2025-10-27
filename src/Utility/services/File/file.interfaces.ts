export interface IFileService {
    createFile(file): Promise<string>;
}
