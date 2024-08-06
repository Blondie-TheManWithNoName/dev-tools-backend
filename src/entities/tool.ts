import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Favorite } from './favorites';
import { Tag } from './tag';
import { IsDefined } from 'class-validator';
import { User } from './user';

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

  @ManyToOne(() => User, (user) => user.user_id)
  posted_by: User;

  @Column({ default: false })
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
