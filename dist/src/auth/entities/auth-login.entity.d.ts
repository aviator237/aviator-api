import { TimestampEntities } from "generics/timestamp.entities";
import { UserEntity } from "src/user/entites/user.entity";
export declare class AuthLoginEntity extends TimestampEntities {
    id: number;
    loginCount: number;
    user: UserEntity;
}
