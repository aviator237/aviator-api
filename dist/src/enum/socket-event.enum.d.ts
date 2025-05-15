export declare enum SocketEventEnum {
    NOUVEAU_JEUX = "newRound",
    FIN_DU_JEUX = "endRound",
    DEBUT_JEUX = "gameStart",
    MONTANT_WALLET = "walletAmount",
    MISE_UTILISATEUR = "userBet",
    MISE_ACCEPTE = "acceptedBet",
    STOP_MISE = "stopBet",
    POURCENTAGE_COURANT = "currentPercent",
    PAYMENT = "payment",
    MISEURS = "roundPlayers",
    MISE_A_JOUR_JOUEUR = "playerUpdate",
    IMPOSSIBLE_DE_MISER = "betDenied",
    ATTENTE_PROCHAIN_TOUR = "betWait",
    ARRET_MISE_EN_ATTENTE = "stopWaitingBet",
    CHANGEMENT_STATUT_PAIEMENT = "paymentStatusUpdate"
}
