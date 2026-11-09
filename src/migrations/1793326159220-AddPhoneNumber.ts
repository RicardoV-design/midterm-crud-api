import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumber1793326159220 implements MigrationInterface {
    name = 'AddPhoneNumber1793326159220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phoneNumber\` varchar(20) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phoneNumber\``);
    }

}
