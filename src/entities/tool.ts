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
import { ToolState } from './tool_state';

@Entity()
export class Tool {
  @PrimaryGeneratedColumn()
  @IsDefined()
  tool_id: number;

  @Column()
  @IsDefined()
  title: string;

  @Column({ unique: true })
  @IsDefined()
  url: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.user_id)
  posted_by: User;

  @ManyToOne(() => ToolState, (toolState) => toolState.state_id)
  state: ToolState;

  @OneToMany(() => Favorite, (favorite) => favorite.tool)
  favorites: Favorite[];

  @ManyToMany(() => Tag, (tag) => tag.tools)
  @JoinTable({
    name: 'tool_tags', // Custom join table name (optional)
    joinColumn: {
      name: 'tool_id',
      referencedColumnName: 'tool_id',
    },
    inverseJoinColumn: {
      name: 'tag_name',
      referencedColumnName: 'name',
    },
  })
  tags: Tag[];
}
