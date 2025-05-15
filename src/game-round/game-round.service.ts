import { Injectable } from '@nestjs/common';
import { CreateGameRoundDto } from './dto/create-game-round.dto';
import { UpdateGameRoundDto } from './dto/update-game-round.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoundEntity } from './entities/game-round.entity';
import { Repository } from 'typeorm';
import { SocketService } from 'src/socket/socket.service';
import { GameRoundStateEnum } from 'src/enum/game-round-state.enum';
import { PlayerBetService } from 'src/player-bet/player-bet.service';

@Injectable()
export class GameRoundService {
  constructor(
    @InjectRepository(GameRoundEntity)
    private readonly gameRoundRepository: Repository<GameRoundEntity>,
    private readonly socketService: SocketService,
    private readonly playerBetService: PlayerBetService,
  ) {
    this.createNewRound();
  }

  async createNewRound() {
    var gameRound = new GameRoundEntity();
    gameRound = await this.gameRoundRepository.save(gameRound);
    this.socketService.sendNewRound(gameRound);
    console.log("Noveau jeu...........................................");

    setTimeout(() => {
      this.startPlaying(gameRound.id);
    }, 10000);
    return gameRound;
  }


  private async startPlaying(gameRoundId: number) {
    console.log("startPlaying...........................................");
    if (PlayerBetService.waitingPlayers) {
      PlayerBetService.waitingPlayers.forEach((playerDto) => {
        playerDto.roundId = gameRoundId;
        this.playerBetService.handleUserBet(playerDto);
      });
      PlayerBetService.waitingPlayers = [];
    }
    var gameRound = await this.gameRoundRepository.findOne({ where: { id: gameRoundId }, relations: { players: true } });
    gameRound.isActive = true;
    gameRound.status = GameRoundStateEnum.EN_COURS;
    gameRound = await this.gameRoundRepository.save(gameRound);
    await this.socketService.sendStartRound(gameRound);
    this.socketService.sendRoundPlayers(gameRound.players);
    const maxCount = Math.floor(Math.random() * 50) + 1;
    console.log("maxCount: ", maxCount)
    for (let i = 0; i < maxCount; i++) {
      gameRound.currentPercent += 0.1;
      gameRound.currentPercent = parseFloat(gameRound.currentPercent.toFixed(2));
      await this.socketService.sendRoundCurrentPercent(gameRound.currentPercent);
      PlayerBetService.currentPercent = gameRound.currentPercent;
      console.log(PlayerBetService.currentPercent);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    PlayerBetService.currentPercent = 0;
    gameRound.isActive = false;
    gameRound.status = GameRoundStateEnum.TERMINE;
    gameRound = await this.gameRoundRepository.save(gameRound);
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
}
