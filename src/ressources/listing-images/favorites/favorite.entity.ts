import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../users/user.entity';
import { Listing } from '../../listings/listing.entity';

@Entity('favorite')
export class Favorite {
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

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  listingId: string;

  @ManyToOne(() => User, user => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Listing, listing => listing.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing: Listing;
}
