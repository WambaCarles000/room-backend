import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

import { User } from '../users/user.entity';
import { ListingImage } from '../listing-images/listing-image.entity';
import { Favorite } from '../listing-images/favorites/favorite.entity';
import { ContactRequest } from '../contact-requests/contact-request.entity';

export enum ListingType {
  STUDIO = 'studio',
  CHAMBRE = 'chambre',
  APPARTEMENT = 'appartement',
}

export enum ListingStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RENTED = 'rented',
}

@Entity({ name: 'listing' })
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ default: false })
  is_active: boolean;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: string;

  @Column({ default: 'XAF' })
  currency: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column({
    type: 'enum',
    enum: ListingType,
  })
  type: ListingType;

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.AVAILABLE,
  })
  status: ListingStatus;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.listings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => ListingImage, (image) => image.listing, {
    cascade: true,
  })
  images: ListingImage[];

  @OneToMany(() => Favorite, (favorite) => favorite.listing)
  favorites: Favorite[];

  @OneToMany(() => ContactRequest, (cr) => cr.listing)
  contactRequests: ContactRequest[];
}
