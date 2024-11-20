import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tool } from './tool';
import { IsDefined } from 'class-validator';
import { ToolInfo } from './tool_info';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  @IsDefined()
  id: number;

  @Column({ unique: true })
  @IsDefined()
  name: string;

  @ManyToMany(() => ToolInfo, (toolInfo) => toolInfo.tags)
  tools: ToolInfo[];
}
