import { Ability, AbilityBuilder, AbilityClass, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { Action } from "src/enum/action.enum";
import { UserRoleEnum } from "src/enum/user-role.enum";
import { UserEntity } from "src/user/entites/user.entity";
type Subjects = InferSubjects<typeof UserEntity | typeof AuthEntity> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;


@Injectable()
export class CaslAbilityFactory {
    createForUser(user: UserEntity) {
        const { can, cannot, build } = new AbilityBuilder<
            MongoAbility<[Action, Subjects]>>(createMongoAbility);

        if (user.role === UserRoleEnum.SUPER_ADMIN) {
            can(Action.Manage, 'all'); // CRUD access to everything
        } else {
            if (user.role === UserRoleEnum.USER) {
                can(Action.Manage, UserEntity, { id: user.id });
                can(Action.Read, UserEntity, { godfather: { id: user.id } });
            } else {
                // if (user.role === UserRoleEnum.COMPANY_ADMIN) {
                // }

                // if (user.role === UserRoleEnum.AGENCY_ADMIN) {
                //     can(Action.Manage, UserEntity, { id: user.id });
                // }
            }
        }
        return build({
            // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}