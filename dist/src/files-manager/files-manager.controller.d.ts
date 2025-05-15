import { StreamableFile } from '@nestjs/common';
import { FilesManagerService } from './files-manager.service';
export declare class FilesManagerController {
    private readonly filesManagerService;
    constructor(filesManagerService: FilesManagerService);
    getOnePictureByUrl(image: string, type: string, category: string): StreamableFile;
}
