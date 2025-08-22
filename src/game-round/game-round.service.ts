import { Injectable } from '@nestjs/common';
import { CreateGameRoundDto } from './dto/create-game-round.dto';
import { UpdateGameRoundDto } from './dto/update-game-round.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoundEntity } from './entities/game-round.entity';
import { Repository } from 'typeorm';
import { SocketService } from 'src/socket/socket.service';
import { GameRoundStateEnum } from 'src/enum/game-round-state.enum';
import { PlayerBetService } from 'src/player-bet/player-bet.service';
import { BetStatus } from 'src/enum/bet-status.enum';
import { PlayerBetEntity } from 'src/player-bet/entities/player-bet.entity';
import { FakeBetGenerator } from 'src/utils/fake-bet.generator';
import { count } from 'console';

@Injectable()
export class GameRoundService {
  private fakeBets: PlayerBetEntity[] = [];
  private recentGameRounds: GameRoundEntity[] = [];

  constructor(
    @InjectRepository(GameRoundEntity)
    private readonly gameRoundRepository: Repository<GameRoundEntity>,
    private readonly socketService: SocketService,
    private readonly playerBetService: PlayerBetService,
    private readonly fakeBetGenerator: FakeBetGenerator,
  ) {
    setTimeout(() => {
      this.createNewRound();
    }, 5000);
  }

  async createNewRound() {
    var gameRound = new GameRoundEntity();
    gameRound = await this.gameRoundRepository.save(gameRound);
    this.socketService.sendNewRound(gameRound);
    console.log("Noveau jeu...........................................");

    setTimeout(() => {
      this.startPlaying(gameRound.id);
    }, 5000);
    return gameRound;
  }


  private async startPlaying(gameRoundId: number) {
    console.log("startPlaying...........................................");
    PlayerBetService.totalWinningAmount = 0;
    // Traiter les mises en attente
    if (PlayerBetService.waitingPlayers && PlayerBetService.waitingPlayers.length > 0) {
      console.log(`Traitement de ${PlayerBetService.waitingPlayers.length} mises en attente`);

      // Créer une copie de la liste pour éviter les problèmes de modification pendant l'itération
      const waitingPlayersCopy = [...PlayerBetService.waitingPlayers];

      // Vider la liste d'attente immédiatement
      PlayerBetService.waitingPlayers = [];

      // Traiter chaque mise en attente de manière asynchrone
      for (const playerDto of waitingPlayersCopy) {
        try {
          playerDto.roundId = gameRoundId;
          await this.playerBetService.handleUserBet(playerDto);
        } catch (error) {
          console.error(`Erreur lors du traitement de la mise en attente: ${error}`);
        }
      }
    }
    var gameRound = await this.gameRoundRepository.findOne({ where: { id: gameRoundId }, relations: { players: true } });
    gameRound.isActive = true;
    gameRound.status = GameRoundStateEnum.EN_COURS;
    gameRound.totalBetAmount = gameRound.players.reduce((total, player) => total + player.amount, 0);
    const expectedLastRound: GameRoundEntity = await this.gameRoundRepository.findOne({ where: { status: GameRoundStateEnum.TERMINE }, order: { createAt: 'DESC' } });
    if (expectedLastRound) {
      gameRound.initialFunds = expectedLastRound.finalFunds;
    } else {
      gameRound.initialFunds = 1000000; // Valeur par défaut si pas de précédent
    }
    gameRound = await this.gameRoundRepository.save(gameRound);

    console.log("+++++++++++++")
    console.log(gameRound.initialFunds)
    console.log(gameRound.totalBetAmount)
    // Générer des paris fictifs si nécessaire
    this.fakeBets = this.fakeBetGenerator.generateFakeBets(gameRound.id, gameRound.players.length);
    if (this.fakeBets.length > 0) {
      gameRound.players = [...gameRound.players, ...this.fakeBets];
    }
    // Trier les joueurs par montant décroissant avant d'envoyer aux clients
    if (gameRound.players && gameRound.players.length > 0) {
      gameRound.players.sort((a, b) => b.amount - a.amount);
    }

    await this.socketService.sendStartRound(gameRound);
    this.socketService.sendRoundPlayers(gameRound.players);

    var maxCount = (Math.floor(Math.random() * 1000));

    var timerValue: number = 100
    const randomStopValue = Math.random();
    if (randomStopValue >= 0.3 && randomStopValue <= 0.2) {
      maxCount = 0;
    }

    console.log("maxCount: ", maxCount)
    for (let i = 0; i < maxCount; i++) {
      if (PlayerBetService.stopRound) {
        PlayerBetService.stopRound = false;
        break;
      }

      const randomLoopStopValue = Math.random();
      if (randomLoopStopValue >= 0.8 && randomStopValue <= 0.81 || randomLoopStopValue >= 0.1 && randomStopValue <= 0.11) {
        break;
      }
      // if (PlayerBetService.totalWinningAmount >= gameRound.totalBetAmount * 80 / 100) {
      //   break;
      // }
      // if (gameRound.currentPercent )
      gameRound.currentPercent += 0.01;
      gameRound.currentPercent = parseFloat(gameRound.currentPercent.toFixed(2));
      await this.socketService.sendRoundCurrentPercent(gameRound.currentPercent);
      PlayerBetService.currentPercent = gameRound.currentPercent;

      // Vérifier les cashouts automatiques
      this.checkAutoCashouts(gameRound);
      console.log(`### ${i}`)

      // Vérifier les paris fictifs
      this.checkFakeBets(gameRound);

      timerValue -= 0.01;
      await new Promise(resolve => setTimeout(resolve, timerValue));
    }

    // Mettre à jour les joueurs qui n'ont pas encaissé (perdants)
    if (gameRound.players && gameRound.players.length > 0) {
      const activePlayers = gameRound.players.filter(player => player.status === BetStatus.MISE);
      for (const player of activePlayers) {
        player.status = BetStatus.PERDUE;
        player.endPercent = gameRound.currentPercent;
        if (player.user?.id?.startsWith('fake_')) {
          // Pour les paris fictifs, pas besoin de sauvegarder en base de données
          this.socketService.sendPlayerUpdate(player);
        } else {
          // Pour les vrais joueurs, mettre à jour en base de données
          await this.updateLosingPlayer(player);
        }
      }
    }

    PlayerBetService.currentPercent = 0;
    gameRound.isActive = false;
    gameRound.status = GameRoundStateEnum.TERMINE;
    gameRound.finalFunds = gameRound.initialFunds + gameRound.totalBetAmount - PlayerBetService.totalWinningAmount;

    gameRound = await this.gameRoundRepository.save(gameRound);
    // console.log(gameRound)
    // Nettoyer la liste des auto-cashouts pour ce tour
    PlayerBetService.clearAutoCheckoutPlayersForRound(gameRound.id);
    // Réinitialiser les paris fictifs
    this.fakeBets = [];

    await this.socketService.sendEndRound(gameRound);
    console.log("Round ended");
    this.sendRecentHistory(gameRound)
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("Creating new round");
    this.createNewRound();
    return gameRound;
  }

  private async checkFakeBets(gameRound: GameRoundEntity): Promise<void> {
    const activeFakeBets = this.fakeBets.filter(bet => bet.status === BetStatus.MISE);

    for (const fakeBet of activeFakeBets) {
      if (this.fakeBetGenerator.shouldCashout(fakeBet, gameRound.currentPercent)) {
        // Calculer le gain
        const winAmount = fakeBet.amount * gameRound.currentPercent;
        fakeBet.winAmount = parseFloat(winAmount.toFixed(2));
        fakeBet.status = BetStatus.GAGNE;
        fakeBet.endPercent = gameRound.currentPercent;

        // Mettre à jour l'affichage pour tous les utilisateurs
        this.socketService.sendPlayerUpdate(fakeBet);

        // Retirer le pari de la liste des paris actifs
        this.fakeBets = this.fakeBets.filter(bet => bet !== fakeBet);
      }
    }
  }

  async sendRecentHistory(lastGameRound) {
    this.recentGameRounds.push(lastGameRound);
    if (this.recentGameRounds.length > 30) {
      this.recentGameRounds.splice(0, 1)
    }
    this.socketService.sendRecentHistory(this.recentGameRounds);
  }

  findOne(id: number) {
    return `This action returns a #${id} gameRound`;
  }

  update(id: number, updateGameRoundDto: UpdateGameRoundDto) {
    return `This action updates a #${id} gameRound`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameRound`;
  }

  /**
   * Vérifie si des joueurs ont atteint leur multiplicateur cible pour le cashout automatique
   * @param gameRound - Le tour de jeu en cours
   */
  private async checkAutoCashouts(gameRound: GameRoundEntity) {
    try {
      // Utiliser la nouvelle méthode processAutoCheckouts qui utilise la liste en mémoire
      // Cette méthode est asynchrone mais nous ne l'attendons pas pour ne pas bloquer la boucle principale
      this.playerBetService.processAutoCheckouts(gameRound.id, gameRound.currentPercent)
        .catch(error => {
          console.error('Erreur lors du traitement des cashouts automatiques:', error);
        });
    } catch (error) {
      console.error('Erreur lors de la vérification des cashouts automatiques:', error);
    }
  }

  /**
   * Met à jour un joueur qui a perdu (n'a pas encaissé avant la fin du tour)
   * @param player - Le joueur à mettre à jour
   */
  private async updateLosingPlayer(player: PlayerBetEntity) {
    try {
      // Utiliser le service PlayerBet pour mettre à jour le joueur
      const updatedPlayer = await this.playerBetService.updatePlayerStatus(player);
      // Envoyer la mise à jour aux clients
      this.socketService.sendPlayerUpdate(updatedPlayer);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du joueur perdant:', error);
    }
  }
}
