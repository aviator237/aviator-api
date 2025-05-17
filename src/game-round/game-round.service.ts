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

@Injectable()
export class GameRoundService {
  constructor(
    @InjectRepository(GameRoundEntity)
    private readonly gameRoundRepository: Repository<GameRoundEntity>,
    private readonly socketService: SocketService,
    private readonly playerBetService: PlayerBetService,
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
    gameRound = await this.gameRoundRepository.save(gameRound);
    await this.socketService.sendStartRound(gameRound);
    this.socketService.sendRoundPlayers(gameRound.players);
    const maxCount = (Math.floor(Math.random() * 50) + 1) * 10;
    console.log("maxCount: ", maxCount)
    for (let i = 0; i < maxCount; i++) {
      gameRound.currentPercent += 0.01;
      gameRound.currentPercent = parseFloat(gameRound.currentPercent.toFixed(2));
      await this.socketService.sendRoundCurrentPercent(gameRound.currentPercent);
      PlayerBetService.currentPercent = gameRound.currentPercent;

      // Vérifier les cashouts automatiques
      this.checkAutoCashouts(gameRound);

      await new Promise(resolve => setTimeout(resolve, 100));
    }
    // Mettre à jour les joueurs qui n'ont pas encaissé (perdants)
    if (gameRound.players && gameRound.players.length > 0) {
      const activePlayers = gameRound.players.filter(player => player.status === BetStatus.MISE);
      for (const player of activePlayers) {
        player.status = BetStatus.PERDUE;
        player.endPercent = gameRound.currentPercent;
        // Utiliser une méthode publique pour mettre à jour les joueurs perdants
        await this.updateLosingPlayer(player);
      }
    }

    PlayerBetService.currentPercent = 0;
    gameRound.isActive = false;
    gameRound.status = GameRoundStateEnum.TERMINE;
    gameRound = await this.gameRoundRepository.save(gameRound);

    // Nettoyer la liste des auto-cashouts pour ce tour
    PlayerBetService.clearAutoCheckoutPlayersForRound(gameRound.id);

    await this.socketService.sendEndRound(gameRound);
    this.createNewRound();
    return gameRound;
  }



  findAll() {
    return `This action returns all gameRound`;
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
