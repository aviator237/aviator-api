"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaslAbilityFactory = void 0;
const ability_1 = require("@casl/ability");
const common_1 = require("@nestjs/common");
const action_enum_1 = require("../../enum/action.enum");
const user_role_enum_1 = require("../../enum/user-role.enum");
const user_entity_1 = require("../../user/entites/user.entity");
let CaslAbilityFactory = class CaslAbilityFactory {
    createForUser(user) {
        const { can, cannot, build } = new ability_1.AbilityBuilder(ability_1.createMongoAbility);
        if (user.role === user_role_enum_1.UserRoleEnum.SUPER_ADMIN) {
            can(action_enum_1.Action.Manage, 'all');
        }
        else {
            if (user.role === user_role_enum_1.UserRoleEnum.USER) {
                can(action_enum_1.Action.Manage, user_entity_1.UserEntity, { id: user.id });
                can(action_enum_1.Action.Read, user_entity_1.UserEntity, { godfather: { id: user.id } });
            }
            else {
            }
        }
        return build({
            detectSubjectType: (item) => item.constructor,
        });
    }
};
exports.CaslAbilityFactory = CaslAbilityFactory;
exports.CaslAbilityFactory = CaslAbilityFactory = __decorate([
    (0, common_1.Injectable)()
], CaslAbilityFactory);
//# sourceMappingURL=casl-ability.factory.js.map