import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Point } from 'typeorm';

@Entity('found_pets')
export class FoundPetEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name!: string;

  @Column()
  species!: string;

  @Column()
  description!: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location!: Point;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
