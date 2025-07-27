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
exports.GameRoundEntity = void 0;
const timestamp_entities_1 = require("../../../generics/timestamp.entities");
const game_round_state_enum_1 = require("../../enum/game-round-state.enum");
const player_bet_entity_1 = require("../../player-bet/entities/player-bet.entity");
const typeorm_1 = require("typeorm");
let GameRoundEntity = class GameRoundEntity extends timestamp_entities_1.TimestampEntities {
};
exports.GameRoundEntity = GameRoundEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GameRoundEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false, default: 1
    }),
    __metadata("design:type", Number)
], GameRoundEntity.prototype, "currentPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false, default: 0
    }),
    __metadata("design:type", Number)
], GameRoundEntity.prototype, "initialFunds", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false, default: 0
    }),
    __metadata("design:type", Number)
], GameRoundEntity.prototype, "totalBetAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false
    }),
    __metadata("design:type", Boolean)
], GameRoundEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: game_round_state_enum_1.GameRoundStateEnum,
        default: game_round_state_enum_1.GameRoundStateEnum.INITIALISE,
        nullable: false
    }),
    __metadata("design:type", String)
], GameRoundEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => player_bet_entity_1.PlayerBetEntity, (player) => player.gameRound),
    __metadata("design:type", Array)
], GameRoundEntity.prototype, "players", void 0);
exports.GameRoundEntity = GameRoundEntity = __decorate([
    (0, typeorm_1.Entity)("game_round")
], GameRoundEntity);
//# sourceMappingURL=game-round.entity.js.map