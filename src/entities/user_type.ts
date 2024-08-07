import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsDefined } from 'class-validator';

@Entity()
export class UserType {
  @PrimaryGeneratedColumn()
  @IsDefined()
  type_id: number;

  @Column({ unique: true })
  @IsDefined()
  type: string;
}
