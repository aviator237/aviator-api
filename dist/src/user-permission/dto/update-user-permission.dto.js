"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPermissionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_user_permission_dto_1 = require("./create-user-permission.dto");
class UpdateUserPermissionDto extends (0, mapped_types_1.PartialType)(create_user_permission_dto_1.CreateUserPermissionDto) {
}
exports.UpdateUserPermissionDto = UpdateUserPermissionDto;
//# sourceMappingURL=update-user-permission.dto.js.map