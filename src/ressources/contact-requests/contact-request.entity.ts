import { Entity, Column, ManyToOne } from 'typeorm';
import { GenericEntity } from '../../common/generic.entity';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';

@Entity()
export class ContactRequest extends GenericEntity {
  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => User, user => user.contactRequests, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Listing, listing => listing.contactRequests, { onDelete: 'CASCADE' })
  listing: Listing;
}
