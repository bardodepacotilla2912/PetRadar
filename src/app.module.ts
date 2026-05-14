import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './core/db/data-source';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { FoundPetsModule } from './found-pets/found-pets.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    LostPetsModule,
    FoundPetsModule,
  ],
})
export class AppModule {}
