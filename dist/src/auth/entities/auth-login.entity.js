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
exports.AuthLoginEntity = void 0;
const timestamp_entities_1 = require("../../../generics/timestamp.entities");
const user_entity_1 = require("../../user/entites/user.entity");
const typeorm_1 = require("typeorm");
let AuthLoginEntity = class AuthLoginEntity extends timestamp_entities_1.TimestampEntities {
};
exports.AuthLoginEntity = AuthLoginEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AuthLoginEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false
    }),
    __metadata("design:type", Number)
], AuthLoginEntity.prototype, "loginCount", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.UserEntity, (user) => user.authLogin),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], AuthLoginEntity.prototype, "user", void 0);
exports.AuthLoginEntity = AuthLoginEntity = __decorate([
    (0, typeorm_1.Entity)("auth-login")
], AuthLoginEntity);
//# sourceMappingURL=auth-login.entity.js.map