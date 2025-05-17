import { UserEntity } from "src/user/entites/user.entity";
export declare class CreatePlayerBetDto {
    reference: string;
    userId: string;
    roundId: number;
    amount: number;
    autoCashoutValue?: number;
    user: UserEntity;
}
