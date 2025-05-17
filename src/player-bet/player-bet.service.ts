import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { GameRoundEntity } from "src/game-round/entities/game-round.entity";
import { PlayerBetEntity } from "./entities/player-bet.entity";
import { UserEntity } from "src/user/entites/user.entity";
import { GameRoundStateEnum } from "src/enum/game-round-state.enum";
import { SocketService } from "src/socket/socket.service";
import { BetStatus } from "src/enum/bet-status.enum";
import { CreatePlayerBetDto } from "./dto/create-player-bet.dto";

@Injectable()
export class PlayerBetService {
  static currentPercent: number = 1;
  static waitingPlayers: CreatePlayerBetDto[] = [];

  // Structure pour stocker les joueurs avec auto-cashout
  static autoCheckoutPlayers: {
    userId: string;
    roundId: number;
    autoCashoutValue: number;
    betId: number;
  }[] = [];
  constructor(
    @InjectRepository(PlayerBetEntity)
    private readonly playerBetRepository: Repository<PlayerBetEntity>,
    @InjectRepository(GameRoundEntity)
    private readonly gameRoundRepository: Repository<GameRoundEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly socketService: SocketService,

  ) {
  }

  async handleUserBet(createPlayerBetDto: CreatePlayerBetDto): Promise<boolean> {
    const round = await this.gameRoundRepository.findOne({ where: { id: createPlayerBetDto.roundId }, relations: { players: true } });
    console.log(round)
    if (!round) {
      this.socketService.sendBetDenied(createPlayerBetDto.userId, createPlayerBetDto.reference);
      return false;
    }
    const user = await this.userRepository.findOneBy({ id: createPlayerBetDto.userId });
    if (!user) {
      return false;
    }

    // Vérifier si l'utilisateur a suffisamment d'argent
    if (user.walletAmount < createPlayerBetDto.amount) {
      this.socketService.sendBetDenied(createPlayerBetDto.userId, createPlayerBetDto.reference);
      return false;
    }

    createPlayerBetDto.user = user;

    if (round.status !== GameRoundStateEnum.INITIALISE) {
      // Déduire le montant du portefeuille de l'utilisateur immédiatement
      user.walletAmount -= createPlayerBetDto.amount;
      await this.userRepository.save(user);
      this.socketService.sendWalletAmount(user.id, user.walletAmount);

      // Ajouter à la liste d'attente
      PlayerBetService.waitingPlayers.push(createPlayerBetDto);
      this.socketService.sendBetWait(createPlayerBetDto.userId, createPlayerBetDto.reference);
      return false;
    }
    user.walletAmount -= createPlayerBetDto.amount;
    await this.userRepository.save(user);
    this.socketService.sendWalletAmount(user.id, user.walletAmount);

    // Créer l'entité PlayerBet
    const playerBet = new PlayerBetEntity();
    playerBet.amount = createPlayerBetDto.amount;
    playerBet.reference = createPlayerBetDto.reference;
    playerBet.user = user;
    playerBet.gameRound = round;

    // Ajouter le multiplicateur cible si défini
    if (createPlayerBetDto.autoCashoutValue) {
      playerBet.autoCashoutValue = createPlayerBetDto.autoCashoutValue;
    }

    // Sauvegarder le pari
    const savedBet = await this.playerBetRepository.save(playerBet);

    // Si un multiplicateur cible est défini, ajouter le joueur à la liste des auto-cashouts
    if (createPlayerBetDto.autoCashoutValue) {
      PlayerBetService.autoCheckoutPlayers.push({
        userId: user.id,
        roundId: round.id,
        autoCashoutValue: createPlayerBetDto.autoCashoutValue,
        betId: savedBet.id
      });
    }
    this.socketService.sendBetAccepted(createPlayerBetDto.userId, createPlayerBetDto.reference);

    round.players.push(playerBet);

    await this.gameRoundRepository.save(round);

    return true;
  }

  async handleUserStopWaitingBet(userId: string, reference: string) {
    for (let index = 0; index < PlayerBetService.waitingPlayers.length; index++) {
      const element = PlayerBetService.waitingPlayers[index];
      if (element.reference === reference) {
        // Récupérer l'utilisateur pour rembourser le montant
        const user = await this.userRepository.findOneBy({ id: userId });
        if (user) {
          // Rembourser le montant de la mise
          user.walletAmount += element.amount;
          await this.userRepository.save(user);

          // Envoyer la mise à jour du portefeuille
          this.socketService.sendWalletAmount(user.id, user.walletAmount);
        }

        // Supprimer de la liste d'attente
        PlayerBetService.waitingPlayers.splice(index, 1);

        // Notifier le client
        this.socketService.sendWaitingBetStop(userId, reference);
        break;
      }
    }
  }


  async handleUserStopBet(userId: string, roundId: number): Promise<boolean> {
    console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      return false;
    }
    console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")

    const round = await this.gameRoundRepository.findOne({ where: { id: roundId }, relations: { players: { user: true } } });
    console.log(round)
    if (!round || round.status !== GameRoundStateEnum.EN_COURS) {
      // this.socketService.sendBetDenied(user.id, round);
      return false;
    }
    console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")

    const player: PlayerBetEntity = await this.playerBetRepository.findOneBy({ gameRound: { id: roundId }, user: { id: userId } })
    // const player: PlayerBetEntity = round.players.find((player) => player.user.id === userId);
    console.log(player)

    if (!player || player.status !== BetStatus.MISE) {
      return false;
    }
    var winAmount: number = player.amount * PlayerBetService.currentPercent;
    winAmount = parseFloat(winAmount.toFixed(2))
    user.walletAmount += winAmount;
    await this.userRepository.save(user);
    player.status = BetStatus.GAGNE;
    player.winAmount = winAmount;
    this.socketService.sendWalletAmount(user.id, user.walletAmount);
    const newPlayer: PlayerBetEntity = await this.playerBetRepository.save(player);
    this.socketService.sendBetStop(user.id, newPlayer);
    this.socketService.sendPlayerUpdate(newPlayer);

    return true;
  }

  /**
   * Récupère l'historique des paris d'un utilisateur avec pagination
   * @param userId - L'identifiant de l'utilisateur
   * @param page - Le numéro de la page
   * @param count - Le nombre d'éléments par page
   * @returns Une liste paginée des paris de l'utilisateur
   */
  async getUserBetHistory(userId: string, page: number, count: number): Promise<PlayerBetEntity[]> {
    return await this.playerBetRepository.find({
      where: { user: { id: userId } },
      relations: { gameRound: true, user: true },
      order: { createAt: "DESC" },
      skip: page * count,
      take: count
    });
  }

  /**
   * Nettoie la liste des joueurs avec auto-cashout pour un tour de jeu spécifique
   * @param gameRoundId - L'identifiant du tour de jeu à nettoyer
   */
  static clearAutoCheckoutPlayersForRound(gameRoundId: number): void {
    PlayerBetService.autoCheckoutPlayers = PlayerBetService.autoCheckoutPlayers.filter(
      player => player.roundId !== gameRoundId
    );
  }

  /**
   * Vérifie et exécute les auto-cashouts pour un tour de jeu et un multiplicateur donnés
   * @param gameRoundId - L'identifiant du tour de jeu
   * @param currentMultiplier - Le multiplicateur actuel
   */
  async processAutoCheckouts(gameRoundId: number, currentMultiplier: number): Promise<void> {
    // Filtrer les joueurs qui ont atteint leur multiplicateur cible
    const playersToCheckout = PlayerBetService.autoCheckoutPlayers.filter(
      player => player.roundId === gameRoundId && player.autoCashoutValue <= currentMultiplier
    );

    // Traiter les cashouts de manière asynchrone
    for (const player of playersToCheckout) {
      // Exécuter le cashout et supprimer le joueur de la liste
      this.handleUserStopBet(player.userId, player.roundId).catch(error => {
        console.error(`Erreur lors du cashout automatique pour l'utilisateur ${player.userId}:`, error);
      });

      // Supprimer le joueur de la liste des auto-cashouts
      const index = PlayerBetService.autoCheckoutPlayers.findIndex(
        p => p.userId === player.userId && p.roundId === player.roundId
      );
      if (index !== -1) {
        PlayerBetService.autoCheckoutPlayers.splice(index, 1);
      }
    }
  }

  /**
   * Récupère tous les joueurs actifs avec un multiplicateur cible défini pour un tour de jeu donné
   * @param gameRoundId - L'identifiant du tour de jeu
   * @returns Une liste des joueurs actifs avec un multiplicateur cible
   * @deprecated Utiliser processAutoCheckouts à la place pour de meilleures performances
   */
  async getActivePlayersWithAutoCashout(gameRoundId: number): Promise<PlayerBetEntity[]> {
    return await this.playerBetRepository.find({
      where: {
        gameRound: { id: gameRoundId },
        status: BetStatus.MISE,
        autoCashoutValue: Not(IsNull())
      },
      relations: { user: true }
    });
  }
}
