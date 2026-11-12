import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagEntity1794390205602 implements MigrationInterface {
    name = 'AddTagEntity1794390205602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6a9775008add570dc3e5a0bab7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tasks_tags_tag\` (\`tasksId\` int NOT NULL, \`tagId\` int NOT NULL, INDEX \`IDX_e956bf1e5f84518b9979bd1792\` (\`tasksId\`), INDEX \`IDX_19bda941e254f4579123f4a1e8\` (\`tagId\`), PRIMARY KEY (\`tasksId\`, \`tagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tasks_tags_tag\` ADD CONSTRAINT \`FK_e956bf1e5f84518b9979bd17922\` FOREIGN KEY (\`tasksId\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tasks_tags_tag\` ADD CONSTRAINT \`FK_19bda941e254f4579123f4a1e8e\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks_tags_tag\` DROP FOREIGN KEY \`FK_19bda941e254f4579123f4a1e8e\``);
        await queryRunner.query(`ALTER TABLE \`tasks_tags_tag\` DROP FOREIGN KEY \`FK_e956bf1e5f84518b9979bd17922\``);
        await queryRunner.query(`DROP INDEX \`IDX_19bda941e254f4579123f4a1e8\` ON \`tasks_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_e956bf1e5f84518b9979bd1792\` ON \`tasks_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`tasks_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a9775008add570dc3e5a0bab7\` ON \`tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
    }

}
