import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayerBetService } from './player-bet.service';
import { CreatePlayerBetDto } from './dto/create-player-bet.dto';
import { UpdatePlayerBetDto } from './dto/update-player-bet.dto';

@Controller('player-bet')
export class PlayerBetController {
  constructor(private readonly playerBetService: PlayerBetService) { }

  // @Post()
  // create(@Body() createPlayerBetDto: CreatePlayerBetDto) {
  //   return this.playerBetService.create(createPlayerBetDto);
  // }

  // @Get()
  // findAll() {
  //   return this.playerBetService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.playerBetService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePlayerBetDto: UpdatePlayerBetDto) {
  //   return this.playerBetService.update(+id, updatePlayerBetDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.playerBetService.remove(+id);
  // }
}
