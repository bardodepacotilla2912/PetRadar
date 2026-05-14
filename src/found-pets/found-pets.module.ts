import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPetEntity } from 'src/core/entities/found-pet.entity';
import { LostPetEntity } from 'src/core/entities/lost-pet.entity';
import { CacheModule } from 'src/cache/cache.module';
import { FoundPetsController } from './found-pets.controller';
import { FoundPetsService } from './found-pets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoundPetEntity, LostPetEntity]),
    CacheModule,
  ],
  controllers: [FoundPetsController],
  providers: [FoundPetsService],
})
export class FoundPetsModule {}
