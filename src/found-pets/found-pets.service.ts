import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundPetEntity } from 'src/core/entities/found-pet.entity';
import { LostPetEntity } from 'src/core/entities/lost-pet.entity';
import { CacheService } from 'src/cache/cache.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { logger } from 'src/conf/logger';

const CACHE_KEY = 'found-pets:all';
const CACHE_TTL = 60;
const SEARCH_RADIUS_METERS = 500;

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPetEntity)
    private readonly foundPetRepository: Repository<FoundPetEntity>,
    @InjectRepository(LostPetEntity)
    private readonly lostPetRepository: Repository<LostPetEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async findAll(): Promise<FoundPetEntity[]> {
    const cached = await this.cacheService.get<FoundPetEntity[]>(CACHE_KEY);
    if (cached && cached.length > 0) {
      logger.info('[FoundPetsService] Returning cached found pets');
      return cached;
    }

    logger.info('[FoundPetsService] Querying found pets from DB');
    const result = await this.foundPetRepository.find();
    await this.cacheService.set(CACHE_KEY, result, CACHE_TTL);
    return result;
  }

  async create(dto: CreateFoundPetDto): Promise<{
    foundPet: FoundPetEntity;
    nearbyLostPets: LostPetEntity[];
  }> {
    const newPet = this.foundPetRepository.create({
      name: dto.name ?? null,
      species: dto.species,
      description: dto.description,
      location: {
        type: 'Point',
        coordinates: [dto.lon, dto.lat],
      },
    });
    const saved = await this.foundPetRepository.save(newPet);
    await this.cacheService.del(CACHE_KEY);
    logger.info(`[FoundPetsService] Found pet created with id=${saved.id}`);

    logger.info(
      `[FoundPetsService] Searching lost pets within ${SEARCH_RADIUS_METERS}m of (${dto.lat}, ${dto.lon})`,
    );
    const nearbyLostPets = await this.lostPetRepository
      .createQueryBuilder('lp')
      .where(
        `
        lp.is_active = true
        AND ST_DWithin(
          lp.location::geography,
          ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
          :radius
        )
        `,
        { lat: dto.lat, lon: dto.lon, radius: SEARCH_RADIUS_METERS },
      )
      .getMany();

    logger.info(
      `[FoundPetsService] Found ${nearbyLostPets.length} matching lost pets nearby`,
    );

    return { foundPet: saved, nearbyLostPets };
  }
}
