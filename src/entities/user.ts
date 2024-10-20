import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Favorite } from './favorites';
import { IsDefined } from 'class-validator';
import { UserTypeEnum } from 'src/enums/user-type';

@Entity()
export class User {
  /** ID */
  @PrimaryGeneratedColumn()
  @IsDefined()
  user_id: number;

  /** Username */
  @Column({ unique: true })
  @IsDefined()
  username: string;

  /** Email */
  @Column({ unique: true })
  @IsDefined()
  email: string;

  /** Password */
  @Column()
  @IsDefined()
  password: string;

  /** Favorites */
  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  /** Type */
  @Column('tinyint', {
    width: 1,
    nullable: false,
    default: () => 2,
    name: 'type',
    transformer: {
      to: (value: string) =>
        value ? Object.keys(UserTypeEnum).indexOf(value) + 1 : 1,
      from: (value: number) => Object.values(UserTypeEnum)[value - 1],
    },
  })
  type: keyof typeof UserTypeEnum;
}
