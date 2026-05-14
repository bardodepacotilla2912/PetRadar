import { Body, Controller, Get, Post } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { logger } from 'src/conf/logger';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Get()
  async findAll() {
    logger.info('[LostPetsController] GET /lost-pets');
    return this.lostPetsService.findAllActive();
  }

  @Post()
  async create(@Body() dto: CreateLostPetDto) {
    logger.info('[LostPetsController] POST /lost-pets');
    return this.lostPetsService.create(dto);
  }
}
