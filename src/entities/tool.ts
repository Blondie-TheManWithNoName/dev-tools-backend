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

@Entity()
export class Website {
  @PrimaryGeneratedColumn()
  website_id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  url: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Favorite, (favorite) => favorite.website)
  favorites: Favorite[];

  @ManyToMany(() => Tag, (tag) => tag.websites)
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
