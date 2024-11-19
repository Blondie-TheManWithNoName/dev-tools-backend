import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsDefined, IsOptional } from 'class-validator';
import { UserTypeEnum } from 'src/enums/user-type';
import { Kit } from './kit';

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

  /** Password */
  @Column()
  @IsOptional()
  avatar: string;

  /** Kits  */
  @OneToMany(() => Kit, (kit) => kit.owner)
  kits: Kit[];

  /** Type */
  @Column('tinyint', {
    width: 1,
    nullable: false,
    default: 2,
    name: 'type',
    transformer: {
      to: (value: string) =>
        value ? Object.keys(UserTypeEnum).indexOf(value) + 1 : 1,
      from: (value: number) => Object.values(UserTypeEnum)[value - 1],
    },
  })
  type: keyof typeof UserTypeEnum;

  /** Followers Count */
  @Column({ type: 'int', default: 0 })
  followerCount: number;

  /** Following Count */
  @Column({ type: 'int', default: 0 })
  followingCount: number;

  /** Followers */
  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'user_followers',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'user_id',
    },
    inverseJoinColumn: {
      name: 'follower_id',
      referencedColumnName: 'user_id',
    },
  })
  followers: User[];

  /** Following */
  @ManyToMany(() => User, (user) => user.followers)
  following: User[];
}
