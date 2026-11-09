import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaskSoftDelete1793917179393 implements MigrationInterface {
    name = 'AddTaskSoftDelete1793917179393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`isDeleted\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`isDeleted\``);
    }

}
