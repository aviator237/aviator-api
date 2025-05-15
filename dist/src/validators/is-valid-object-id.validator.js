"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidObjectIdConstraint = void 0;
exports.IsValidObjectId = IsValidObjectId;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();
const MYSQL_ADDON_HOST = process.env.MYSQL_ADDON_HOST;
const MYSQL_ADDON_PORT = parseInt(process.env.MYSQL_ADDON_PORT);
const MYSQL_ADDON_USER = process.env.MYSQL_ADDON_USER;
const MYSQL_ADDON_PASSWORD = process.env.MYSQL_ADDON_PASSWORD;
const MYSQL_ADDON_DB = process.env.MYSQL_ADDON_DB;
const MYSQL_ADDON_URI = `mysql://${MYSQL_ADDON_USER}:${MYSQL_ADDON_PASSWORD}@${MYSQL_ADDON_HOST}:${MYSQL_ADDON_PORT}/${MYSQL_ADDON_DB}`;
let IsValidObjectIdConstraint = class IsValidObjectIdConstraint {
    async validate(id, args) {
        const myDataSource = new typeorm_1.DataSource({
            type: "mysql",
            url: MYSQL_ADDON_URI,
            entities: ["dist/**/*.entity{.ts,.js}"],
        });
        await myDataSource.initialize();
        const repository = myDataSource.getRepository(args.constraints[0]);
        const result = await repository.findOneBy({ id: id }).then(user => {
            if (user)
                return true;
            return false;
        });
        myDataSource.destroy();
        return result;
    }
    defaultMessage(validationArguments) {
        return `Cant Not Found ${validationArguments.property} in Database : ${validationArguments.value}`;
    }
    ;
};
exports.IsValidObjectIdConstraint = IsValidObjectIdConstraint;
exports.IsValidObjectIdConstraint = IsValidObjectIdConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: true })
], IsValidObjectIdConstraint);
function IsValidObjectId(target, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [target],
            validator: IsValidObjectIdConstraint,
        });
    };
}
//# sourceMappingURL=is-valid-object-id.validator.js.map