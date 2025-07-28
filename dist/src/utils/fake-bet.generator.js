"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeBetGenerator = void 0;
const common_1 = require("@nestjs/common");
const bet_status_enum_1 = require("../enum/bet-status.enum");
const player_bet_entity_1 = require("../player-bet/entities/player-bet.entity");
const user_entity_1 = require("../user/entites/user.entity");
let FakeBetGenerator = class FakeBetGenerator {
    constructor() {
        this.names = [
            'John', 'Emma', 'Alex', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Anna', 'David', 'Julia',
            'Peter', 'Mary', 'Chris', 'Laura', 'James', 'Sophie', 'Daniel', 'Nina', 'Paul', 'Amy'
        ];
        this.phoneNumbers = Array.from({ length: 20 }, (_, i) => `+237699${String(i + 1).padStart(6, '0')}`);
    }
    generateFakeUser() {
        const index = Math.floor(Math.random() * this.names.length);
        const user = new user_entity_1.UserEntity();
        user.id = `fake_${Math.random().toString(36).substr(2, 9)}`;
        user.phoneNumber = this.phoneNumbers[index];
        user.walletAmount = 1000000;
        return user;
    }
    generateFakeBets(gameRoundId, currentRealBets) {
        if (currentRealBets >= 10)
            return [];
        const numberOfFakeBets = 20 - currentRealBets;
        const fakeBets = [];
        for (let i = 0; i < numberOfFakeBets; i++) {
            const fakeUser = this.generateFakeUser();
            const bet = new player_bet_entity_1.PlayerBetEntity();
            const id = Math.random().toString(36).substr(2, 9);
            bet.id = Math.round(Math.random() * 10000);
            bet.user = fakeUser;
            bet.amount = this.generateRandomAmount();
            bet.reference = `fake_${id}`;
            bet.status = bet_status_enum_1.BetStatus.MISE;
            bet.autoCashoutValue = Math.random() < 0.7 ? this.generateRandomAutoCashout() : null;
            console.log(bet.autoCashoutValue);
            fakeBets.push(bet);
        }
        return fakeBets;
    }
    generateRandomAmount() {
        return Math.floor(Math.random() * (100000 - 50 + 1)) + 50;
    }
    generateRandomAutoCashout() {
        return Number((1.2 + Math.random() * 100).toFixed(2));
    }
    shouldCashout(bet, currentMultiplier) {
        if (bet.autoCashoutValue && currentMultiplier >= bet.autoCashoutValue) {
            return true;
        }
        if (bet.autoCashoutValue && currentMultiplier < bet.autoCashoutValue) {
            return false;
        }
        const betIdNumber = parseInt(bet.reference.replace('fake_', ''), 36);
        const riskTolerance = (betIdNumber % 100) / 100;
        const baseThreshold = 0.05 + (riskTolerance * 0.15);
        const multiplierFactor = Math.pow(currentMultiplier, 1.5);
        const dynamicThreshold = baseThreshold * multiplierFactor;
        const randomFactor = Math.random() * 0.1;
        const cashoutProbability = Math.min(dynamicThreshold + randomFactor, 0.45) - 0.2;
        return Math.random() < cashoutProbability;
    }
};
exports.FakeBetGenerator = FakeBetGenerator;
exports.FakeBetGenerator = FakeBetGenerator = __decorate([
    (0, common_1.Injectable)()
], FakeBetGenerator);
//# sourceMappingURL=fake-bet.generator.js.map