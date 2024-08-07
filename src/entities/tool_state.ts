import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsDefined } from 'class-validator';

@Entity()
export class ToolState {
  @PrimaryGeneratedColumn()
  @IsDefined()
  state_id: number;

  @Column({ unique: true })
  @IsDefined()
  state: string;
}
