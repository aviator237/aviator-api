"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthentificatedSocketAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class AuthentificatedSocketAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app) {
        super(app);
        this.app = app;
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.use(async (socket, next) => {
            var _a, _b;
            const tokenPayload = (_b = (_a = socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token;
            if (!tokenPayload) {
                return next(new Error("Token not provided"));
            }
            const [method, token] = tokenPayload.split(" ");
            if (method !== "Bearer") {
                return next(new Error("Invalide authentification method, Only Bearer is supported."));
            }
            try {
                socket.user = {};
                return next();
            }
            catch (error) {
                return next(new Error("Authentification error"));
            }
        });
        return server;
    }
}
exports.AuthentificatedSocketAdapter = AuthentificatedSocketAdapter;
//# sourceMappingURL=authentificated-socket.adapter.js.map