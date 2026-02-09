import { Entity, Column, OneToMany } from 'typeorm';
import { GenericEntity } from '../../common/generic.entity';
import { Listing } from '../listings/listing.entity';
import { Favorite } from '../listing-images/favorites/favorite.entity';
import { ContactRequest } from '../contact-requests/contact-request.entity';

export enum UserRole {
  OWNER = 'owner',
  TENANT = 'tenant',
  ADMIN = 'admin',
}

@Entity()
export class User extends GenericEntity {
  @Column({ unique: true })
  supabase_id: string; // ID de l'utilisateur dans Supabase Auth (sub du JWT)

  @Column({ nullable: true })
  email: string; // Email  Supabase

  @Column({ type: 'enum', enum: UserRole, default: UserRole.TENANT })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => Listing, listing => listing.owner)
  listings: Listing[];

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => ContactRequest, cr => cr.user)
  contactRequests: ContactRequest[];
}
