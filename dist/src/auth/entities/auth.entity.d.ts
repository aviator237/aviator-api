import { TimestampEntities } from "generics/timestamp.entities";
import { UserEntity } from "src/user/entites/user.entity";
export declare class AuthEntity extends TimestampEntities {
    id: number;
    emailToken: string;
    user: UserEntity;
}
