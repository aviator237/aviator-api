import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { UserEntity } from "src/user/entites/user.entity";

export class CreatePlayerBetDto {

    @IsNotEmpty()
    @IsString()
    reference: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsNumber()
    roundId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    amount: number;

    @IsOptional()
    user: UserEntity;

}
