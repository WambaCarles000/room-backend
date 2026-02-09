import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { GenericEntity } from '../../common/generic.entity';
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

@Entity()
export class Listing extends GenericEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column('numeric')
  price: number;

  @Column({ default: 'XAF' })
  currency: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column({ type: 'enum', enum: ListingType })
  type: ListingType;

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.AVAILABLE })
  status: ListingStatus;

  @ManyToOne(() => User, user => user.listings, { nullable: true })
  owner: User | null;

  @OneToMany(() => ListingImage, image => image.listing)
  images: ListingImage[];

  @OneToMany(() => Favorite, favorite => favorite.listing)
  favorites: Favorite[];

  @OneToMany(() => ContactRequest, cr => cr.listing)
  contactRequests: ContactRequest[];
}
