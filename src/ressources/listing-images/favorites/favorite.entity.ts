import { Entity, ManyToOne } from 'typeorm';
import { GenericEntity } from '../../../common/generic.entity';
import { User } from '../../users/user.entity';
import { Listing } from '../../listings/listing.entity';

@Entity()
export class Favorite extends GenericEntity {
  @ManyToOne(() => User, user => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Listing, listing => listing.favorites, { onDelete: 'CASCADE' })
  listing: Listing;
}
