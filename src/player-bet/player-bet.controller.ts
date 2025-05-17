import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { PlayerBetService } from './player-bet.service';
import { CreatePlayerBetDto } from './dto/create-player-bet.dto';
import { UpdatePlayerBetDto } from './dto/update-player-bet.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/token-auth/Guard/jwt-auth.guard';
import { User } from 'src/decorators/users.decorator';
import { UserEntity } from 'src/user/entites/user.entity';

@Controller('player-bet')
export class PlayerBetController {
  constructor(private readonly playerBetService: PlayerBetService) { }

  /**
   * Récupère l'historique des paris d'un utilisateur avec pagination
   * @param req - La requête contenant les informations de l'utilisateur
   * @param page - Le numéro de la page (par défaut: 0)
   * @param count - Le nombre d'éléments par page (par défaut: 20)
   * @returns Une liste paginée des paris de l'utilisateur
   */
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getUserBetHistory(
    @Query('page') page: number = 0,
    @Query('count') count: number = 20,
      @User() user: UserEntity
  ) {
    return this.playerBetService.getUserBetHistory(user.id, page, count);
  }
}
