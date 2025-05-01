import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';

import { IsDefined } from 'class-validator';
import { Tag } from './tag';
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

  @Column({ nullable: false })
  description: string;

  @ManyToMany(() => Tag, (tag) => tag.tools)
  @JoinTable({
    name: 'tool_tags',
    joinColumns: [
      { name: 'id', referencedColumnName: 'id' },
      { name: 'valid', referencedColumnName: 'valid' },
    ],
    inverseJoinColumns: [{ name: 'tag_id', referencedColumnName: 'id' }],
  })
  tags: Tag[];

  @Column({ nullable: true })
  faviconPath: string;

  @PrimaryColumn('boolean')
  valid: boolean;

  constructor(data?: {
    id: number;
    valid: boolean;
    tags: Tag[];
    title: string;
    description: string;
    url: string;
    faviconPath: string;
  }) {
    if (data) {
      const { id, valid, tags, title, description, url, faviconPath } = data;
      this.id = id;
      this.valid = valid;
      this.tags = tags;
      this.title = title;
      this.description = description;
      this.url = url;
      this.faviconPath = faviconPath;
    }
  }
}
