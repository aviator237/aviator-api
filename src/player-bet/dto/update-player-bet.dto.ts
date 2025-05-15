import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerBetDto } from './create-player-bet.dto';

export class UpdatePlayerBetDto extends PartialType(CreatePlayerBetDto) {}
