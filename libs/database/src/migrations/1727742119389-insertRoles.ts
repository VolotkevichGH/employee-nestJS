import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertRoles1727742119389 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("INSERT INTO roles (id, title) VALUES ('37054f85-f553-411f-8e2f-2a5ad84b41e9', 'user')");
        await queryRunner.query("INSERT INTO roles (id, title) VALUES ('49c035c2-5e7a-4ef8-bb70-52de05bbe0ec', 'hr')");
        await queryRunner.query("INSERT INTO roles (id, title) VALUES ('4a364a3e-e172-4dc9-9023-c31a6ef46d19', 'accountant')");
        await queryRunner.query("INSERT INTO roles (id, title) VALUES ('f85ab9d9-bbf3-402b-8e2b-7db2d13acd35', 'director')");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
