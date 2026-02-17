import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";

export class GenericEntity {
  @Column("uuid", { default: () => "uuid_generate_v4()" })
  uuid: string;

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
