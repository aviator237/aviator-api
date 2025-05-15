"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlayerBetDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_player_bet_dto_1 = require("./create-player-bet.dto");
class UpdatePlayerBetDto extends (0, mapped_types_1.PartialType)(create_player_bet_dto_1.CreatePlayerBetDto) {
}
exports.UpdatePlayerBetDto = UpdatePlayerBetDto;
//# sourceMappingURL=update-player-bet.dto.js.map