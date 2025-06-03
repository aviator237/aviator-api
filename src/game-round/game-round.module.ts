import { Module } from '@nestjs/common';
import { GameRoundService } from './game-round.service';
import { GameRoundController } from './game-round.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRoundEntity } from './entities/game-round.entity';
import { SocketService } from 'src/socket/socket.service';
import { PlayerBetService } from 'src/player-bet/player-bet.service';
import { PlayerBetEntity } from 'src/player-bet/entities/player-bet.entity';
import { UserEntity } from 'src/user/entites/user.entity';
import { FakeBetGenerator } from 'src/utils/fake-bet.generator';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameRoundEntity, PlayerBetEntity, UserEntity]),
  ],
  controllers: [GameRoundController],
  providers: [GameRoundService, SocketService, PlayerBetService, FakeBetGenerator],
})
export class GameRoundModule { }
