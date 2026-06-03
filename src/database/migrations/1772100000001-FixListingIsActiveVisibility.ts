import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixListingIsActiveVisibility1772100000001 implements MigrationInterface {
  name = 'FixListingIsActiveVisibility1772100000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "listing" SET "is_active" = true WHERE "status" != 'sold' AND "archived_at" IS NULL`,
    );
    await queryRunner.query(
      `UPDATE "listing" SET "is_active" = false WHERE "status" = 'sold' OR "archived_at" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Pas de retour arrière automatique sur is_active
  }
}
