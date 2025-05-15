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
exports.AuthEntity = void 0;
const timestamp_entities_1 = require("../../../generics/timestamp.entities");
const user_entity_1 = require("../../user/entites/user.entity");
const typeorm_1 = require("typeorm");
let AuthEntity = class AuthEntity extends timestamp_entities_1.TimestampEntities {
};
exports.AuthEntity = AuthEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AuthEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        unique: true,
    }),
    __metadata("design:type", String)
], AuthEntity.prototype, "emailToken", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], AuthEntity.prototype, "user", void 0);
exports.AuthEntity = AuthEntity = __decorate([
    (0, typeorm_1.Entity)("auth")
], AuthEntity);
//# sourceMappingURL=auth.entity.js.map