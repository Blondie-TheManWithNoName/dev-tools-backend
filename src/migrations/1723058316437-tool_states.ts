import { MigrationInterface, QueryRunner } from 'typeorm';

export class ToolStates1723058316437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert rows using query builder
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('tool_state')
      .values([
        { state: 'pending', state_id: 1 },
        { state: 'approved', state_id: 2 },
        { state: 'declined', state_id: 3 },
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
