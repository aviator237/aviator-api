"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissionModule = void 0;
const common_1 = require("@nestjs/common");
const user_permission_service_1 = require("./user-permission.service");
const user_permission_controller_1 = require("./user-permission.controller");
let UserPermissionModule = class UserPermissionModule {
};
exports.UserPermissionModule = UserPermissionModule;
exports.UserPermissionModule = UserPermissionModule = __decorate([
    (0, common_1.Module)({
        controllers: [user_permission_controller_1.UserPermissionController],
        providers: [user_permission_service_1.UserPermissionService],
    })
], UserPermissionModule);
//# sourceMappingURL=user-permission.module.js.map