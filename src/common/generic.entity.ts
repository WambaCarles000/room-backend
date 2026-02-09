import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export class GenericEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  updated_at: Date;

  //Implémente le soft delete ,les données ne sont pas réellement supprimées
  @DeleteDateColumn({
    nullable: true,
  })
  deleted_at: Date;

  @Column({ default: false })
  is_active: boolean;
}
  