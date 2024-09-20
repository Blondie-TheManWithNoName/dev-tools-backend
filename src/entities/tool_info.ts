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
import { Tag } from './tag';
import { IsDefined } from 'class-validator';
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

  @PrimaryColumn()
  @Column({ unique: false })
  @IsDefined()
  url: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Tag, (tag) => tag.tools)
  @JoinTable({
    name: 'tool_tags',
    joinColumns: [
      { name: 'tool_id', referencedColumnName: 'tool_id' },
      { name: 'valid', referencedColumnName: 'valid' },
    ],
    inverseJoinColumns: [{ name: 'tag_id', referencedColumnName: 'tag_id' }],
  })
  tags: Tag[];

  @PrimaryColumn('boolean')
  valid: boolean;
}
