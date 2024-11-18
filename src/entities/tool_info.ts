import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Tag } from './tag';
import { IsDefined } from 'class-validator';
import { Tool } from './tool';

@Unique(['url', 'valid'])
@Entity()
export class ToolInfo {
  @PrimaryColumn()
  @IsDefined()
  id: number;

  @ManyToOne(() => Tool, (tool) => tool.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
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
      { name: 'id', referencedColumnName: 'id' },
      { name: 'valid', referencedColumnName: 'valid' },
    ],
    inverseJoinColumns: [{ name: 'tag_id', referencedColumnName: 'tag_id' }],
  })
  tags: Tag[];

  @PrimaryColumn('boolean')
  valid: boolean;
}
