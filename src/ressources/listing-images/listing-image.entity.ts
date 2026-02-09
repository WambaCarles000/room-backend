import { Entity, Column, ManyToOne } from 'typeorm';
import { GenericEntity } from '../../common/generic.entity';
import { Listing } from '../listings/listing.entity';

@Entity()
export class ListingImage extends GenericEntity {
  @Column()
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Listing, listing => listing.images, { onDelete: 'CASCADE' })
  listing: Listing;
}
