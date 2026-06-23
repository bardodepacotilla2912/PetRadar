import { DataSourceOptions, DataSource } from 'typeorm';
import { LostPetEntity } from '../entities/lost-pet.entity';
import { FoundPetEntity } from '../entities/found-pet.entity';
import { envs } from '../../conf/envs';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  entities: [LostPetEntity, FoundPetEntity],
  synchronize: true,
  ssl: envs.DB_SSL ? { rejectUnauthorized: false } : false,
};

export const dataSource = new DataSource(dataSourceOptions);
