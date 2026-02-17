import { MigrationInterface, QueryRunner } from "typeorm";

export class AddListingFields1771272800000 implements MigrationInterface {
    name = 'AddListingFields1771272800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ajouter la nouvelle valeur à l'enum ListingStatus
        await queryRunner.query(`ALTER TYPE "public"."listing_status_enum" ADD VALUE 'taken'`);
        
        // Ajouter les nouvelles colonnes
        await queryRunner.query(`ALTER TABLE "listing" ADD "square_meters" numeric(10,2) NULL`);
        await queryRunner.query(`ALTER TABLE "listing" ADD "deposit_months" integer NULL`);
        await queryRunner.query(`ALTER TABLE "listing" ADD "availability_date" TIMESTAMP NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer les colonnes
        await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "availability_date"`);
        await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "deposit_months"`);
        await queryRunner.query(`ALTER TABLE "listing" DROP COLUMN "square_meters"`);
        
        // Note: Dans PostgreSQL, on ne peut pas supprimer une valeur d'enum simplement
        // Cette migration est à adapter si nécessaire selon votre BD
    }
}
