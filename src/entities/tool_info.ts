import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Favorite } from './favorites';
import { Tag } from './tag';
import { IsDefined } from 'class-validator';
import { User } from './user';
import { ToolState } from './tool_state';
import { Tool } from './tool';

@Entity()
export class ToolInfo {
  @PrimaryColumn()
  @IsDefined()
  tool_id: number;

  @ManyToOne(() => Tool, (tool) => tool.tool_id)
  @JoinColumn({ name: 'tool_id' })
  tool: Tool;

  @Column()
  @IsDefined()
  title: string;

  @Column({ unique: true })
  @IsDefined()
  url: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Tag, (tag) => tag.tools)
  @JoinTable({
    name: 'tool_tags', // Custom join table name
    joinColumns: [
      { name: 'tool_id', referencedColumnName: 'tool_id' },
      { name: 'valid', referencedColumnName: 'valid' },
    ],
    inverseJoinColumns: [{ name: 'tag_id', referencedColumnName: 'tag_id' }],
  })
  tags: Tag[];

  @PrimaryColumn('boolean')
  valid: boolean; // Part of the composite key
}
