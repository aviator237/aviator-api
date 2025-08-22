import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameRoundService } from './game-round.service';
import { CreateGameRoundDto } from './dto/create-game-round.dto';
import { UpdateGameRoundDto } from './dto/update-game-round.dto';

@Controller('game-round')
export class GameRoundController {
  constructor(private readonly gameRoundService: GameRoundService) { }

  // @Post()
  // create(@Body() createGameRoundDto: CreateGameRoundDto) {
  //   return this.gameRoundService.createNewRound(createGameRoundDto);
  // }

  // @Get()
  // findAll() {
  //   return this.gameRoundService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameRoundService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameRoundDto: UpdateGameRoundDto) {
    return this.gameRoundService.update(+id, updateGameRoundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameRoundService.remove(+id);
  }
}
