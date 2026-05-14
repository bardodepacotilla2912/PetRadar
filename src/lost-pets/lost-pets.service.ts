import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPetEntity } from 'src/core/entities/lost-pet.entity';
import { CacheService } from 'src/cache/cache.service';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { logger } from 'src/conf/logger';

const CACHE_KEY = 'lost-pets:active';
const CACHE_TTL = 60;

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPetEntity)
    private readonly lostPetRepository: Repository<LostPetEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async findAllActive(): Promise<LostPetEntity[]> {
    const cached = await this.cacheService.get<LostPetEntity[]>(CACHE_KEY);
    if (cached && cached.length > 0) {
      logger.info('[LostPetsService] Returning cached active lost pets');
      return cached;
    }

    logger.info('[LostPetsService] Querying active lost pets from DB');
    const result = await this.lostPetRepository.find({
      where: { isActive: true },
    });
    await this.cacheService.set(CACHE_KEY, result, CACHE_TTL);
    return result;
  }

  async create(dto: CreateLostPetDto): Promise<LostPetEntity> {
    const newPet = this.lostPetRepository.create({
      name: dto.name,
      species: dto.species,
      description: dto.description,
      ownerEmail: dto.ownerEmail,
      isActive: true,
      location: {
        type: 'Point',
        coordinates: [dto.lon, dto.lat],
      },
    });
    const saved = await this.lostPetRepository.save(newPet);
    await this.cacheService.del(CACHE_KEY);
    logger.info(`[LostPetsService] Lost pet created with id=${saved.id}`);
    return saved;
  }
}
