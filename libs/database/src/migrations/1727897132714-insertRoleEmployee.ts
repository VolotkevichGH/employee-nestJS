import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertRoleEmployee1727897132714 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("INSERT INTO roles (id, title) VALUES (uuid_generate_v4(), 'employee')");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
