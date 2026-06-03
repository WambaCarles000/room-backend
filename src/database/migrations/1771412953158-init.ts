import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1771412953158 implements MigrationInterface {
    name = 'Init1771412953158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "listing_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP DEFAULT NOW(), "deleted_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT false, "imageUrl" character varying NOT NULL, "order" integer NOT NULL DEFAULT '0', "listingId" uuid, CONSTRAINT "PK_5884ca1c2018515c1d738fd18e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP DEFAULT NOW(), "deleted_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT false, "userId" uuid, "listingId" uuid, CONSTRAINT "PK_495675cec4fb09666704e4f610f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP DEFAULT NOW(), "deleted_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT false, "message" text NOT NULL, "userId" uuid, "listingId" uuid, CONSTRAINT "PK_d74ea9b4efcf950e4f98d14b173" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."listing_type_enum" AS ENUM('studio', 'chambre', 'appartement')`);
        await queryRunner.query(`CREATE TYPE "public"."listing_status_enum" AS ENUM('available', 'sold', 'rented', 'taken')`);
        await queryRunner.query(`CREATE TABLE "listing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP DEFAULT NOW(), "deleted_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL, "description" text NOT NULL, "price" numeric(12,2) NOT NULL, "currency" character varying NOT NULL DEFAULT 'XAF', "city" character varying NOT NULL, "district" character varying NOT NULL, "type" "public"."listing_type_enum" NOT NULL, "status" "public"."listing_status_enum" NOT NULL DEFAULT 'available', "square_meters" numeric(10,2), "deposit_months" integer, "availability_date" TIMESTAMP, "ownerId" uuid, CONSTRAINT "PK_381d45ebb8692362c156d6b87d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('owner', 'tenant', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP DEFAULT NOW(), "deleted_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT false, "supabase_id" character varying NOT NULL, "email" character varying, "first_name" character varying, "last_name" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'tenant', "phone" character varying, CONSTRAINT "UQ_a5792b64aabfca3cca0db2f6258" UNIQUE ("supabase_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reports_reason_enum" AS ENUM('spam', 'fraud', 'inappropriate', 'harassment', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."reports_status_enum" AS ENUM('pending', 'reviewed', 'resolved', 'dismissed')`);
        await queryRunner.query(`CREATE TABLE "reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" "public"."reports_reason_enum" NOT NULL, "description" text NOT NULL, "status" "public"."reports_status_enum" NOT NULL DEFAULT 'pending', "admin_notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "reported_by_id" uuid, "reported_user_id" uuid, "listing_id" uuid, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "listing_image" ADD CONSTRAINT "FK_b0d09774d741ddf347b214b95e0" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_fc0de60d650b005296eabb57a3f" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD CONSTRAINT "FK_484bfed0268fefb35dcbff6485e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD CONSTRAINT "FK_ec79054d03b60610e1cccb1675f" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_256d873dbdeb71430e9ed22c1b2" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_fbb0cc68aaa46fae3cd0fd20b93" FOREIGN KEY ("reported_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_a9197bd0a7e06bb92648d9efed2" FOREIGN KEY ("reported_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_d1cdc1ed639c70f2ec0bc33e166" FOREIGN KEY ("listing_id") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_d1cdc1ed639c70f2ec0bc33e166"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_a9197bd0a7e06bb92648d9efed2"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_fbb0cc68aaa46fae3cd0fd20b93"`);
        await queryRunner.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_256d873dbdeb71430e9ed22c1b2"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP CONSTRAINT "FK_ec79054d03b60610e1cccb1675f"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP CONSTRAINT "FK_484bfed0268fefb35dcbff6485e"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_fc0de60d650b005296eabb57a3f"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d"`);
        await queryRunner.query(`ALTER TABLE "listing_image" DROP CONSTRAINT "FK_b0d09774d741ddf347b214b95e0"`);
        await queryRunner.query(`DROP TABLE "reports"`);
        await queryRunner.query(`DROP TYPE "public"."reports_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."reports_reason_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "listing"`);
        await queryRunner.query(`DROP TYPE "public"."listing_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."listing_type_enum"`);
        await queryRunner.query(`DROP TABLE "contact_request"`);
        await queryRunner.query(`DROP TABLE "favorite"`);
        await queryRunner.query(`DROP TABLE "listing_image"`);
    }

}
