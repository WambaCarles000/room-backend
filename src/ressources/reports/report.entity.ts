import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'reported_by_id' })
  reported_by: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'reported_user_id' })
  reported_user?: User;

  @ManyToOne(() => Listing, { nullable: true, eager: true })
  @JoinColumn({ name: 'listing_id' })
  listing?: Listing;

  @Column({
    type: 'enum',
    enum: ['spam', 'fraud', 'inappropriate', 'harassment', 'other'],
  })
  reason: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  admin_notes?: string;

  @CreateDateColumn()
  created_at: Date;
}
