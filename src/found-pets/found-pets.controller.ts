import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { logger } from 'src/conf/logger';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Get()
  async findAll() {
    logger.info('[FoundPetsController] GET /found-pets');
    return this.foundPetsService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateFoundPetDto) {
    logger.info('[FoundPetsController] POST /found-pets');
    return this.foundPetsService.create(dto);
  }
}
