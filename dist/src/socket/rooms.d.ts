import { Server } from "socket.io";
export declare function getUserDeviceRoom(userId: string, userRole: string): string;
export declare function sendToUserDevice(server: Server, userId: string, userRole: string, event: string, payload: any): void;
