import { PlayerBetEntity } from 'src/player-bet/entities/player-bet.entity';
import { UserEntity } from 'src/user/entites/user.entity';
export declare class FakeBetGenerator {
    private readonly names;
    private readonly phoneNumbers;
    generateFakeUser(): UserEntity;
    generateFakeBets(gameRoundId: number, currentRealBets: number): PlayerBetEntity[];
    private generateRandomAmount;
    private generateRandomAutoCashout;
    shouldCashout(bet: PlayerBetEntity, currentMultiplier: number): boolean;
}
