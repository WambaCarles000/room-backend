import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoomToListingImage1793923200000 implements MigrationInterface {
  name = 'AddRoomToListingImage1793923200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_image" ADD COLUMN IF NOT EXISTS "room" character varying NOT NULL DEFAULT 'general'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_image" DROP COLUMN IF EXISTS "room"`,
    );
  }
}
