import { StreamableFile } from '@nestjs/common';
export declare class FilesManagerService {
    constructor();
    saveFile(file: Express.Multer.File, type: string, folder: string, preserveFilename?: boolean): Promise<void>;
    saveFile1(file: Express.Multer.File, type: string, folder: string, preserveFilename?: boolean): string;
    getImage(image?: string, type?: string, category?: string, fullPath?: string): StreamableFile;
    getImageUrl: (path: string) => string;
    getTicketImageUrl: (ticketId: string) => string;
    getFilesPath: () => string;
    fileExist(image?: string, type?: string, category?: string): boolean;
}
