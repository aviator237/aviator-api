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
exports.UserSubscribeDto = void 0;
const class_validator_1 = require("class-validator");
const user_lang_enum_1 = require("../../enum/user-lang.enum");
class UserSubscribeDto {
}
exports.UserSubscribeDto = UserSubscribeDto;
__decorate([
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserSubscribeDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(30),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserSubscribeDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserSubscribeDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserSubscribeDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UserSubscribeDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(15),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserSubscribeDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_lang_enum_1.UserLangEnum),
    __metadata("design:type", String)
], UserSubscribeDto.prototype, "lang", void 0);
//# sourceMappingURL=User-subscribe.dto.js.map