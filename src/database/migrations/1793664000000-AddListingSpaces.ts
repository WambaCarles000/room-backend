import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddListingSpaces1793664000000 implements MigrationInterface {
  name = 'AddListingSpaces1793664000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing" ADD COLUMN IF NOT EXISTS "spaces" jsonb NOT NULL DEFAULT '{}'::jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN IF EXISTS "spaces"`);
  }
}