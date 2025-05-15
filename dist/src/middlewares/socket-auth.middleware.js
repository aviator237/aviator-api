"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthWsMiddleware = void 0;
const passport_jwt_strategy_1 = require("../token-auth/strategy/passport-jwt.strategy");
const AuthWsMiddleware = (jwtService, configService, userService, userEntityRepository) => {
    return async (socket, next) => {
        var _a, _b;
        try {
            const token = (_b = (_a = socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token;
            if (!token) {
                throw new Error("Authorization token is missing");
            }
            let payload = null;
            try {
                payload = await jwtService.verifyAsync(token);
            }
            catch (error) {
                throw new Error("Authorization token is invalid");
            }
            const strategy = new passport_jwt_strategy_1.JwtStrategy(configService, userEntityRepository);
            const user = await strategy.validate(payload);
            if (!user) {
                throw new Error("User does not exist");
            }
            socket = Object.assign(socket, {
                user: user,
            });
            next();
        }
        catch (error) {
            next(new Error("Unauthorized"));
        }
    };
};
exports.AuthWsMiddleware = AuthWsMiddleware;
//# sourceMappingURL=socket-auth.middleware.js.map