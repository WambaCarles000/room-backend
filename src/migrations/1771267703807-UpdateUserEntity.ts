import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1771267703807 implements MigrationInterface {
    name = 'UpdateUserEntity1771267703807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing_image" DROP CONSTRAINT "FK_b0d09774d741ddf347b214b95e0"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_fc0de60d650b005296eabb57a3f"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP CONSTRAINT "FK_484bfed0268fefb35dcbff6485e"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP CONSTRAINT "FK_ec79054d03b60610e1cccb1675f"`);
        await queryRunner.query(`CREATE TYPE "public"."listings_type_enum" AS ENUM('studio', 'chambre', 'appartement')`);
        await queryRunner.query(`CREATE TYPE "public"."listings_status_enum" AS ENUM('available', 'sold', 'rented')`);
        await queryRunner.query(`CREATE TABLE "listings" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "uid" character varying NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "price" numeric(12,2) NOT NULL, "currency" character varying NOT NULL DEFAULT 'XAF', "city" character varying NOT NULL, "district" character varying NOT NULL, "type" "public"."listings_type_enum" NOT NULL, "status" "public"."listings_status_enum" NOT NULL DEFAULT 'available', "user_id" integer, CONSTRAINT "UQ_5aa4136385f504b0377be517941" UNIQUE ("uid"), CONSTRAINT "PK_1e65f7fdea73e7c26a6291e9815" PRIMARY KEY ("uuid", "id"))`);
        await queryRunner.query(`ALTER TABLE "listing_image" DROP CONSTRAINT "PK_5884ca1c2018515c1d738fd18e7"`);
        await queryRunner.query(`ALTER TABLE "listing_image" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "PK_495675cec4fb09666704e4f610f"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP CONSTRAINT "PK_d74ea9b4efcf950e4f98d14b173"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "listing_image" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "listing_image" ADD CONSTRAINT "PK_400d20d518c0d9464dcf5498620" PRIMARY KEY ("uuid")`);
        await queryRunner.query(`ALTER TABLE "listing_image" ADD "listingUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "PK_2fe5ab9098659fc29e79f824847" PRIMARY KEY ("uuid")`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD "listingUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD CONSTRAINT "PK_40f2bade0fe38a0cc687fb90f16" PRIMARY KEY ("uuid")`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD "listingUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_3a3aed0a19c7bfa39d07cc3ab91" PRIMARY KEY ("id", "uuid")`);
        await queryRunner.query(`ALTER TABLE "listing_image" DROP COLUMN "listingId"`);
        await queryRunner.query(`ALTER TABLE "listing_image" ADD "listingId" integer`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP COLUMN "listingId"`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD "listingId" integer`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP COLUMN "listingId"`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD "listingId" integer`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_3a3aed0a19c7bfa39d07cc3ab91"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_a95e949168be7b7ece1a2382fed"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_3a3aed0a19c7bfa39d07cc3ab91" PRIMARY KEY ("uuid", "id")`);
        await queryRunner.query(`ALTER TABLE "listing_image" ADD CONSTRAINT "FK_c40027c03a3fd9772faeb452ccf" FOREIGN KEY ("listingUuid", "listingId") REFERENCES "listings"("uuid","id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_a43e3c32b3f349be558f939ec4b" FOREIGN KEY ("listingUuid", "listingId") REFERENCES "listings"("uuid","id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD CONSTRAINT "FK_4c206f19839432dd1bd0690b6c0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD CONSTRAINT "FK_9547e95008dac94f45b30ffb1ed" FOREIGN KEY ("listingUuid", "listingId") REFERENCES "listings"("uuid","id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_3f1539dda02eba4738ac5859ded" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_3f1539dda02eba4738ac5859ded"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP CONSTRAINT "FK_9547e95008dac94f45b30ffb1ed"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP CONSTRAINT "FK_4c206f19839432dd1bd0690b6c0"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_a43e3c32b3f349be558f939ec4b"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_e666fc7cc4c80fba1944daa1a74"`);
        await queryRunner.query(`ALTER TABLE "listing_image" DROP CONSTRAINT "FK_c40027c03a3fd9772faeb452ccf"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_3a3aed0a19c7bfa39d07cc3ab91"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_a95e949168be7b7ece1a2382fed"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_3a3aed0a19c7bfa39d07cc3ab91" PRIMARY KEY ("id", "uuid")`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP COLUMN "listingId"`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD "listingId" uuid`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP COLUMN "listingId"`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD "listingId" uuid`);
        await queryRunner.query(`ALTER TABLE "listing_image" DROP COLUMN "listingId"`);
        await queryRunner.query(`ALTER TABLE "listing_image" ADD "listingId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_3a3aed0a19c7bfa39d07cc3ab91"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP COLUMN "listingUuid"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP CONSTRAINT "PK_40f2bade0fe38a0cc687fb90f16"`);
        await queryRunner.query(`ALTER TABLE "contact_request" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP COLUMN "listingUuid"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "PK_2fe5ab9098659fc29e79f824847"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "listing_image" DROP COLUMN "listingUuid"`);
        await queryRunner.query(`ALTER TABLE "listing_image" DROP CONSTRAINT "PK_400d20d518c0d9464dcf5498620"`);
        await queryRunner.query(`ALTER TABLE "listing_image" DROP COLUMN "uuid"`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD CONSTRAINT "PK_d74ea9b4efcf950e4f98d14b173" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "PK_495675cec4fb09666704e4f610f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "listing_image" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "listing_image" ADD CONSTRAINT "PK_5884ca1c2018515c1d738fd18e7" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "listings"`);
        await queryRunner.query(`DROP TYPE "public"."listings_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."listings_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD CONSTRAINT "FK_ec79054d03b60610e1cccb1675f" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_request" ADD CONSTRAINT "FK_484bfed0268fefb35dcbff6485e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_fc0de60d650b005296eabb57a3f" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing_image" ADD CONSTRAINT "FK_b0d09774d741ddf347b214b95e0" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
