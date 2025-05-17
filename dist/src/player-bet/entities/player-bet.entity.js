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
exports.PlayerBetEntity = void 0;
const timestamp_entities_1 = require("../../../generics/timestamp.entities");
const bet_status_enum_1 = require("../../enum/bet-status.enum");
const game_round_entity_1 = require("../../game-round/entities/game-round.entity");
const user_entity_1 = require("../../user/entites/user.entity");
const typeorm_1 = require("typeorm");
let PlayerBetEntity = class PlayerBetEntity extends timestamp_entities_1.TimestampEntities {
};
exports.PlayerBetEntity = PlayerBetEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PlayerBetEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        type: "float"
    }),
    __metadata("design:type", Number)
], PlayerBetEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: "float",
        default: 0
    }),
    __metadata("design:type", Number)
], PlayerBetEntity.prototype, "winAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: "float",
        default: 0
    }),
    __metadata("design:type", Number)
], PlayerBetEntity.prototype, "endPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
    }),
    __metadata("design:type", String)
], PlayerBetEntity.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: bet_status_enum_1.BetStatus,
        default: bet_status_enum_1.BetStatus.MISE,
        nullable: false
    }),
    __metadata("design:type", String)
], PlayerBetEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: "float",
        default: null
    }),
    __metadata("design:type", Number)
], PlayerBetEntity.prototype, "autoCashoutValue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => game_round_entity_1.GameRoundEntity, (gameRound) => gameRound.players),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", game_round_entity_1.GameRoundEntity)
], PlayerBetEntity.prototype, "gameRound", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.bets),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], PlayerBetEntity.prototype, "user", void 0);
exports.PlayerBetEntity = PlayerBetEntity = __decorate([
    (0, typeorm_1.Entity)("player_bet")
], PlayerBetEntity);
//# sourceMappingURL=player-bet.entity.js.map