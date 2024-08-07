import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTypes1723058041158 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert rows using query builder
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user_type')
      .values([
        { type: 'admin', type_id: 1 },
        { type: 'client', type_id: 2 },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete rows using query builder
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('user_type')
      .where('type_id IN (:...ids)', { ids: [1, 2] })
      .execute();
  }
}
