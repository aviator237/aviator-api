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
exports.IsValidObjectIdPipe = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();
const MYSQL_ADDON_HOST = process.env.MYSQL_ADDON_HOST;
const MYSQL_ADDON_PORT = parseInt(process.env.MYSQL_ADDON_PORT);
const MYSQL_ADDON_USER = process.env.MYSQL_ADDON_USER;
const MYSQL_ADDON_PASSWORD = process.env.MYSQL_ADDON_PASSWORD;
const MYSQL_ADDON_DB = process.env.MYSQL_ADDON_DB;
const MYSQL_ADDON_URI = `mysql://${MYSQL_ADDON_USER}:${MYSQL_ADDON_PASSWORD}@${MYSQL_ADDON_HOST}:${MYSQL_ADDON_PORT}/${MYSQL_ADDON_DB}`;
let IsValidObjectIdPipe = class IsValidObjectIdPipe {
    constructor(target) {
        this.target = target;
    }
    async transform(entry, metadata) {
        const myDataSource = new typeorm_1.DataSource({
            type: "mysql",
            url: MYSQL_ADDON_URI,
            entities: ["dist/**/*.entity{.ts,.js}"],
        });
        await myDataSource.initialize();
        const repository = myDataSource.getRepository(this.target);
        const myObjectExist = await repository.findOneBy({ id: entry }).then(object => {
            if (object)
                return true;
            return false;
        });
        myDataSource.destroy();
        if (!myObjectExist) {
            throw new common_1.NotFoundException(`Validation failed : Cant Not Found Object With Id: ${entry}`);
        }
        return entry;
    }
};
exports.IsValidObjectIdPipe = IsValidObjectIdPipe;
exports.IsValidObjectIdPipe = IsValidObjectIdPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], IsValidObjectIdPipe);
//# sourceMappingURL=is-valid-object-id.pipe.js.map