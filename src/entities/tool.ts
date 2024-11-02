import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Favorite } from './favorites';
import { IsDefined } from 'class-validator';
import { User } from './user';
import { ToolStateEnum } from 'src/enums/tool-state';

@Entity()
export class Tool {
  /** ID */
  @PrimaryGeneratedColumn()
  @IsDefined()
  id: number;

  /** State */
  @Column('tinyint', {
    width: 1,
    nullable: false,
    default: 1,
    name: 'state',
    transformer: {
      to: (value: string) =>
        value ? Object.keys(ToolStateEnum).indexOf(value) + 1 : 1,
      from: (value: number) => Object.values(ToolStateEnum)[value - 1],
    },
  })
  state: keyof typeof ToolStateEnum;

  /** Posted By */
  @ManyToOne(() => User, (user) => user.user_id)
  @IsDefined()
  posted_by: User;

  /** Favorites */
  @OneToMany(() => Favorite, (favorite) => favorite.tool)
  @IsDefined()
  favorites: Favorite[];
}
