"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDeviceRoom = getUserDeviceRoom;
exports.sendToUserDevice = sendToUserDevice;
function getUserDeviceRoom(userId, userRole) {
    return `user:${userId}-role:${userRole}`;
}
function sendToUserDevice(server, userId, userRole, event, payload) {
    server.to(getUserDeviceRoom(userId, userRole)).emit(event, payload);
}
//# sourceMappingURL=rooms.js.map