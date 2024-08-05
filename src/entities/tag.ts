import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { Website } from './tool';

@Entity()
export class Tag {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => Website, (website) => website.tags)
  websites: Website[];
}
