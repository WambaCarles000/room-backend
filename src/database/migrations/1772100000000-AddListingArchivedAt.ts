import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddListingArchivedAt1772100000000 implements MigrationInterface {
  name = 'AddListingArchivedAt1772100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing" ADD COLUMN IF NOT EXISTS "archived_at" TIMESTAMP`,
    );
    // Catalogue public : is_active = true sauf vendu ou archivé
    await queryRunner.query(
      `UPDATE "listing" SET "is_active" = true WHERE "status" != 'sold' AND "archived_at" IS NULL`,
    );
    await queryRunner.query(
      `UPDATE "listing" SET "is_active" = false WHERE "status" = 'sold' OR "archived_at" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN IF EXISTS "archived_at"`);
  }
}
