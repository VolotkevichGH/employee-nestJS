import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesAndUsers1727742085230 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`)
        // await queryRunner.query('CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "age" integer NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "address" character varying NOT NULL, "phone" character varying NOT NULL, "state" character varying NOT NULL, "gender" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))')
        // await queryRunner.query('CREATE TABLE "user_roles" ("user_id" INTEGER NOT NULL, "role_id" INTEGER NOT NULL, PRIMARY KEY (user_id, role_id), FOREIGN KEY (user_id) REFERENCES users, FOREIGN KEY (role_id) REFERENCES roles)')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
