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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesManagerController = void 0;
const common_1 = require("@nestjs/common");
const files_manager_service_1 = require("./files-manager.service");
const skip_auth_decorator_1 = require("../decorators/skip-auth.decorator");
const path = require('path');
let FilesManagerController = class FilesManagerController {
    constructor(filesManagerService) {
        this.filesManagerService = filesManagerService;
    }
    getOnePictureByUrl(image, type, category) {
        return this.filesManagerService.getImage(image, type, category);
    }
};
exports.FilesManagerController = FilesManagerController;
__decorate([
    (0, skip_auth_decorator_1.SkipAuth)(),
    (0, common_1.Get)(":type/:category/:image"),
    __param(0, (0, common_1.Param)("image")),
    __param(1, (0, common_1.Param)("type")),
    __param(2, (0, common_1.Param)("category")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", common_1.StreamableFile)
], FilesManagerController.prototype, "getOnePictureByUrl", null);
exports.FilesManagerController = FilesManagerController = __decorate([
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_manager_service_1.FilesManagerService])
], FilesManagerController);
//# sourceMappingURL=files-manager.controller.js.map