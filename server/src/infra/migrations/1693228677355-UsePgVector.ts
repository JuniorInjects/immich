import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsePgVector1693228677355 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS vector');
    await queryRunner.query(`ALTER TABLE "asset_faces" ALTER COLUMN "embedding" TYPE vector`);
    await queryRunner.query(`ALTER TABLE "smart_info" ALTER COLUMN "clipEmbedding" TYPE vector`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "asset_faces" ALTER COLUMN "embedding" TYPE real array`);
    await queryRunner.query(`ALTER TABLE "smart_info" ALTER COLUMN "clipEmbedding" TYPE real array`);
  }
}
