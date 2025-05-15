"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGameRoundDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_game_round_dto_1 = require("./create-game-round.dto");
class UpdateGameRoundDto extends (0, mapped_types_1.PartialType)(create_game_round_dto_1.CreateGameRoundDto) {
}
exports.UpdateGameRoundDto = UpdateGameRoundDto;
//# sourceMappingURL=update-game-round.dto.js.map