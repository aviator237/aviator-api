"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEventEnum = void 0;
var SocketEventEnum;
(function (SocketEventEnum) {
    SocketEventEnum["NOUVEAU_JEUX"] = "newRound";
    SocketEventEnum["FIN_DU_JEUX"] = "endRound";
    SocketEventEnum["DEBUT_JEUX"] = "gameStart";
    SocketEventEnum["MONTANT_WALLET"] = "walletAmount";
    SocketEventEnum["MISE_UTILISATEUR"] = "userBet";
    SocketEventEnum["MISE_ACCEPTE"] = "acceptedBet";
    SocketEventEnum["STOP_MISE"] = "stopBet";
    SocketEventEnum["POURCENTAGE_COURANT"] = "currentPercent";
    SocketEventEnum["PAYMENT"] = "payment";
    SocketEventEnum["MISEURS"] = "roundPlayers";
    SocketEventEnum["MISE_A_JOUR_JOUEUR"] = "playerUpdate";
    SocketEventEnum["IMPOSSIBLE_DE_MISER"] = "betDenied";
    SocketEventEnum["ATTENTE_PROCHAIN_TOUR"] = "betWait";
    SocketEventEnum["ARRET_MISE_EN_ATTENTE"] = "stopWaitingBet";
    SocketEventEnum["CHANGEMENT_STATUT_PAIEMENT"] = "paymentStatusUpdate";
    SocketEventEnum["RECENT_HISTORY"] = "recentHistory";
})(SocketEventEnum || (exports.SocketEventEnum = SocketEventEnum = {}));
//# sourceMappingURL=socket-event.enum.js.map