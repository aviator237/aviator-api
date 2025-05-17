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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerBetController = void 0;
const common_1 = require("@nestjs/common");
const player_bet_service_1 = require("./player-bet.service");
const jwt_auth_guard_1 = require("../token-auth/Guard/jwt-auth.guard");
const users_decorator_1 = require("../decorators/users.decorator");
const user_entity_1 = require("../user/entites/user.entity");
let PlayerBetController = class PlayerBetController {
    constructor(playerBetService) {
        this.playerBetService = playerBetService;
    }
    async getUserBetHistory(page = 0, count = 20, user) {
        return this.playerBetService.getUserBetHistory(user.id, page, count);
    }
};
exports.PlayerBetController = PlayerBetController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('count')),
    __param(2, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], PlayerBetController.prototype, "getUserBetHistory", null);
exports.PlayerBetController = PlayerBetController = __decorate([
    (0, common_1.Controller)('player-bet'),
    __metadata("design:paramtypes", [player_bet_service_1.PlayerBetService])
], PlayerBetController);
//# sourceMappingURL=player-bet.controller.js.map