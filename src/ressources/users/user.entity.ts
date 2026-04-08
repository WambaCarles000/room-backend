import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from '../listings/listing.entity';
import { Favorite } from '../listing-images/favorites/favorite.entity';
import { ContactRequest } from '../contact-requests/contact-request.entity';

export enum UserRole {
  OWNER = 'owner',
  TENANT = 'tenant',
  ADMIN = 'admin',
}

@Entity()
export class User {
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

  @Column({ unique: true })
  supabase_id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

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
