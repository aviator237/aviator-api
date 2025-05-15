"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesManagerService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const path = require('path');
const fs = require("fs");
let FilesManagerService = class FilesManagerService {
    constructor() {
        this.getImageUrl = (path) => path.includes("https://") ? path : `${process.env.SERVER_URI}/files/${path}`;
        this.getTicketImageUrl = (ticketId) => `${process.env.SERVER_URI}/passenger/ticket-code/${ticketId}`;
        this.getFilesPath = () => 'files';
    }
    async saveFile(file, type, folder, preserveFilename) {
    }
    saveFile1(file, type, folder, preserveFilename) {
        var directory = path.join(this.getFilesPath(), type, folder, !preserveFilename ? file.originalname : `${Date.now()}-${file.originalname}`);
        console.log(directory);
        const writeStream = fs.createWriteStream(directory);
        writeStream.write(file.buffer);
        writeStream.on('finish', () => {
            console.log(`File saved successfully: ${directory}`);
        });
        writeStream.on('error', (err) => {
            console.error('Error writing file:', err);
            throw new Error('Failed to write file');
        });
        return `${type}/${folder}/${file.originalname}`;
    }
    getImage(image, type, category, fullPath) {
        const file = (0, fs_1.createReadStream)(fullPath ? fullPath : (0, path_1.join)(process.cwd(), path.join(this.getFilesPath(), type, category, image)));
        return new common_1.StreamableFile(file);
    }
    fileExist(image, type, category) {
        const cheminAbsolut = (0, path_1.join)(process.cwd(), path.join(this.getFilesPath(), type, category, image));
        try {
            fs.accessSync(cheminAbsolut, fs.constants.F_OK);
            return true;
        }
        catch (err) {
            return false;
        }
    }
};
exports.FilesManagerService = FilesManagerService;
exports.FilesManagerService = FilesManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FilesManagerService);
//# sourceMappingURL=files-manager.service.js.map