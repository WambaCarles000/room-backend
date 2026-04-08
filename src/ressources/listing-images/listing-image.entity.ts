import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Listing } from '../listings/listing.entity';

@Entity('listing_image')
export class ListingImage {
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
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'uuid', nullable: true })
  listingId: string;

  @ManyToOne(() => Listing, listing => listing.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing: Listing;
}
