import { Injectable } from '@nestjs/common';
import { BetStatus } from 'src/enum/bet-status.enum';
import { PlayerBetEntity } from 'src/player-bet/entities/player-bet.entity';
import { UserEntity } from 'src/user/entites/user.entity';

@Injectable()
export class FakeBetGenerator {
    private readonly names = [
        'John', 'Emma', 'Alex', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Anna', 'David', 'Julia',
        'Peter', 'Mary', 'Chris', 'Laura', 'James', 'Sophie', 'Daniel', 'Nina', 'Paul', 'Amy'
    ];

    private readonly phoneNumbers = Array.from({ length: 20 }, (_, i) => `+237699${String(i + 1).padStart(6, '0')}`);

    /**
     * Génère un utilisateur factice
     */
    generateFakeUser(): UserEntity {
        const index = Math.floor(Math.random() * this.names.length);
        const user = new UserEntity();
        user.id = `fake_${Math.random().toString(36).substr(2, 9)}`;
        user.phoneNumber = this.phoneNumbers[index];
        user.walletAmount = 1000000; // Un gros portefeuille pour les utilisateurs fictifs
        return user;
    }

    /**
     * Génère des paris fictifs pour un tour de jeu
     * @param gameRoundId ID du tour de jeu
     * @param currentRealBets Nombre de paris réels actuels
     * @param maxFakeBets Nombre maximum de paris fictifs à générer
     */
    generateFakeBets(gameRoundId: number, currentRealBets: number): PlayerBetEntity[] {
        // Si il y a déjà 10 paris ou plus, ne pas générer de paris fictifs
        if (currentRealBets >= 10) return [];

        // Calculer combien de paris fictifs nous devons générer
        const numberOfFakeBets = 20 - currentRealBets;
        const fakeBets: PlayerBetEntity[] = [];

        for (let i = 0; i < numberOfFakeBets; i++) {
            const fakeUser = this.generateFakeUser();
            const bet = new PlayerBetEntity();
            const id = Math.random().toString(36).substr(2, 9);
            bet.id = Math.round(Math.random() * 10000);
            bet.user = fakeUser;
            bet.amount = this.generateRandomAmount();
            bet.reference = `fake_${id}`;
            bet.status = BetStatus.MISE;
            bet.autoCashoutValue = Math.random() < 0.7 ? this.generateRandomAutoCashout() : null; // 70% de chance d'avoir un auto-cashout
            console.log(bet.autoCashoutValue);
            fakeBets.push(bet);
        }

        return fakeBets;
    }

    /**
     * Génère un montant aléatoire pour un pari fictif
     */
    private generateRandomAmount(): number {
        return Math.floor(Math.random() * (100000 - 50 + 1)) + 50;
    }

    /**
     * Génère une valeur d'auto-cashout aléatoire
     */
    private generateRandomAutoCashout(): number {
        return Number((1.2 + Math.random() * 100).toFixed(2));
        // return Number((1.2 + Math.random() * 3.8).toFixed(2));
    }

    /**
     * Détermine si un pari fictif doit être encaissé à un multiplicateur donné
     */
    shouldCashout(bet: PlayerBetEntity, currentMultiplier: number): boolean {
        // Si le pari a un auto-cashout défini, l'honorer
        if (bet.autoCashoutValue && currentMultiplier >= bet.autoCashoutValue) {
            return true;
        }

        if (bet.autoCashoutValue && currentMultiplier < bet.autoCashoutValue) {
            return false;
        }

        // Pour les paris sans auto-cashout, utiliser une logique plus sophistiquée
        // Chaque pari a son propre "style de jeu" basé sur son ID
        const betIdNumber = parseInt(bet.reference.replace('fake_', ''), 36);

        // Utiliser l'ID pour créer un style de jeu unique pour ce pari
        const riskTolerance = (betIdNumber % 100) / 100; // Valeur entre 0 et 1
        const baseThreshold = 0.05 + (riskTolerance * 0.15); // Entre 0.05 et 0.20

        // Plus le multiplicateur est élevé, plus la chance d'encaisser augmente
        const multiplierFactor = Math.pow(currentMultiplier, 1.5);
        const dynamicThreshold = baseThreshold * multiplierFactor;

        // Ajouter un élément aléatoire pour plus de naturel
        const randomFactor = Math.random() * 0.1; // Petite variation aléatoire

        // La probabilité finale est influencée par :
        // 1. Le style de jeu du parieur (riskTolerance)🎁💸💎
        // 2. Le multiplicateur actuel (multiplierFactor)
        // 3. Un élément aléatoire (randomFactor)
        const cashoutProbability = Math.min(dynamicThreshold + randomFactor, 0.45) - 0.2;

        // console.log(Math.random() < cashoutProbability)
        return Math.random() < cashoutProbability;
    }
}
