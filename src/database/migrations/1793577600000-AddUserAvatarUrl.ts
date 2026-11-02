import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAvatarUrl1793577600000 implements MigrationInterface {
  name = 'AddUserAvatarUrl1793577600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "avatar_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "avatar_url"`);
  }
}