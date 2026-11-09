import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1793325965868 implements MigrationInterface {
    name = 'InitialSchema1793325965868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phoneNumber\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phoneNumber\` varchar(20) NULL`);
    }

}
