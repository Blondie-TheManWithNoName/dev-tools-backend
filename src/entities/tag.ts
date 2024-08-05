import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { Tool } from './tool';
import { IsDefined } from 'class-validator';

@Entity()
export class Tag {
  @PrimaryColumn()
  @IsDefined()
  name: string;

  @ManyToMany(() => Tool, (tool) => tool.tags)
  tools: Tool[];
}
