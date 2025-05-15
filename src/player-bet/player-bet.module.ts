import { Module } from '@nestjs/common';
import { PlayerBetService } from './player-bet.service';
import { PlayerBetController } from './player-bet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerBetEntity } from './entities/player-bet.entity';
import { GameRoundEntity } from 'src/game-round/entities/game-round.entity';
import { UserEntity } from 'src/user/entites/user.entity';
import { SocketService } from 'src/socket/socket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerBetEntity, GameRoundEntity, UserEntity]),
  ],
  controllers: [PlayerBetController],
  providers: [PlayerBetService, SocketService],
  exports: [PlayerBetService]
})
export class PlayerBetModule { }
