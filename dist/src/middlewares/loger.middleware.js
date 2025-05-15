"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const Logger = (req, res, next) => {
    console.log("ip:", req.ip);
    next();
};
exports.Logger = Logger;
//# sourceMappingURL=loger.middleware.js.map