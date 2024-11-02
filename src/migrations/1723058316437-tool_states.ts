import { MigrationInterface, QueryRunner } from 'typeorm';

export class ToolStates1723058316437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert rows using query builder
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('tool_state')
      .values([
        { state: 'PENDING', state_id: 1 },
        { state: 'APPROVED', state_id: 2 },
        { state: 'rejected', state_id: 3 },
        { state: 'UPDATED', state_id: 4 },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete rows using query builder
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('tool_state')
      .where('state_id IN (:...ids)', { ids: [1, 2, 3] })
      .execute();
  }
}
