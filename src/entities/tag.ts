import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tool } from './tool';
import { IsDefined } from 'class-validator';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  @IsDefined()
  id: number;

  @Column({ unique: true })
  @IsDefined()
  name: string;

  @ManyToMany(() => Tool, (tool) => tool.tags)
  tools: Tool[];
}
