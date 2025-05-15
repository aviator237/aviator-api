import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
    createPlayerBetDto.user = user;

    if (round.status !== GameRoundStateEnum.INITIALISE) {
      PlayerBetService.waitingPlayers.push(createPlayerBetDto);
      this.socketService.sendBetWait(createPlayerBetDto.userId, createPlayerBetDto.reference);
      return false;
    }


    if (user.walletAmount < createPlayerBetDto.amount) {
      return false;
    }
    user.walletAmount -= createPlayerBetDto.amount;
    await this.userRepository.save(user);
    this.socketService.sendWalletAmount(user.id, user.walletAmount);

    const playerBet = await this.playerBetRepository.save(createPlayerBetDto);
    this.socketService.sendBetAccepted(createPlayerBetDto.userId, createPlayerBetDto.reference);

    round.players.push(playerBet);

    await this.gameRoundRepository.save(round);

    return true;
  }

  async handleUserStopWaitingBet(userId: string, reference: string) {
    for (let index = 0; index < PlayerBetService.waitingPlayers.length; index++) {
      const element = PlayerBetService.waitingPlayers[index];
      if (element.reference === reference) {
        PlayerBetService.waitingPlayers.splice(index, 1);
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
}
