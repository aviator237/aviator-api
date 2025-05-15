"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileBuffer = void 0;
const common_1 = require("@nestjs/common");
exports.FileBuffer = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.fileBuffer || null;
});
//# sourceMappingURL=file-buffer.decorator.js.map