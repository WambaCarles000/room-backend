import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1771327288017 implements MigrationInterface {
    name = 'Migrations1771327288017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_256d873dbdeb71430e9ed22c1b2"`);
        await queryRunner.query(`ALTER TABLE "listing" ADD "square_meters" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "listing" ADD "deposit_months" integer`);
        await queryRunner.query(`ALTER TABLE "listing" ADD "availability_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "listing" ALTER COLUMN "price" TYPE numeric(12,2)`);
        await queryRunner.query(`ALTER TYPE "public"."listing_status_enum" RENAME TO "listing_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."listing_status_enum" AS ENUM('available', 'sold', 'rented', 'taken')`);
        await queryRunner.query(`ALTER TABLE "listing" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "listing" ALTER COLUMN "status" TYPE "public"."listing_status_enum" USING "status"::"text"::"public"."listing_status_enum"`);
        await queryRunner.query(`ALTER TABLE "listing" ALTER COLUMN "status" SET DEFAULT 'available'`);
        await queryRunner.query(`DROP TYPE "public"."listing_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_256d873dbdeb71430e9ed22c1b2" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_256d873dbdeb71430e9ed22c1b2"`);
        await queryRunner.query(`CREATE TYPE "public"."listing_status_enum_old" AS ENUM('available', 'sold', 'rented')`);
        await queryRunner.query(`ALTER TABLE "listing" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "listing" ALTER COLUMN "status" TYPE "public"."listing_status_enum_old" USING "status"::"text"::"public"."listing_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "listing" ALTER COLUMN "status" SET DEFAULT 'available'`);
        await queryRunner.query(`DROP TYPE "public"."listing_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."listing_status_enum_old" RENAME TO "listing_status_enum"`);
        await queryRunner.query(`ALTER TABLE "listing" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "availability_date"`);
        await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "deposit_months"`);
        await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "square_meters"`);
        await queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_256d873dbdeb71430e9ed22c1b2" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
