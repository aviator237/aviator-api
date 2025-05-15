import { InferSubjects, MongoAbility } from "@casl/ability";
import { AuthEntity } from "src/auth/entities/auth.entity";
import { Action } from "src/enum/action.enum";
import { UserEntity } from "src/user/entites/user.entity";
type Subjects = InferSubjects<typeof UserEntity | typeof AuthEntity> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;
export declare class CaslAbilityFactory {
    createForUser(user: UserEntity): MongoAbility<[Action, Subjects], import("@casl/ability").MongoQuery>;
}
export {};
