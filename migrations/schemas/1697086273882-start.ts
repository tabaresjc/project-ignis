import { MigrationInterface, QueryRunner } from "typeorm";

export class Start1697086273882 implements MigrationInterface {
    name = 'Start1697086273882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(30) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`phrase\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`format\` varchar(15) NULL,
                \`file_path\` varchar(1024) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`phrase\`
            ADD CONSTRAINT \`FK_98f78852b2644a62673f8de5b63\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`phrase\` DROP FOREIGN KEY \`FK_98f78852b2644a62673f8de5b63\`
        `);
        await queryRunner.query(`
            DROP TABLE \`phrase\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    }

}
