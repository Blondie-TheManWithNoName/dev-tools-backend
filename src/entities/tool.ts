import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Favorite } from './favorites';
import { Tag } from './tag';
import { IsDefined } from 'class-validator';

@Entity()
export class Tool {
  @PrimaryGeneratedColumn()
  @IsDefined()
  tool_id: number;

  @Column()
  @IsDefined()
  title: string;

  @Column()
  @IsDefined()
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  approved: boolean;

  @OneToMany(() => Favorite, (favorite) => favorite.tool)
  favorites: Favorite[];

  @ManyToMany(() => Tag, (tag) => tag.tools)
  //   @JoinTable({
  //     name: 'website_tags', // Custom join table name (optional)
  //     joinColumn: {
  //       name: 'website_id',
  //       referencedColumnName: 'website_id',
  //     },
  //     inverseJoinColumn: {
  //       name: 'tag_name',
  //       referencedColumnName: 'name',
  //     },
  //   })
  tags: Tag[];
}
