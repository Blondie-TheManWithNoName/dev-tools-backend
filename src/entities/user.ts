import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Favorite } from './favorites';
import { IsDefined } from 'class-validator';
import { UserType } from './user_type';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsDefined()
  user_id: number;

  @Column({ unique: true })
  @IsDefined()
  username: string;

  @Column({ unique: true })
  @IsDefined()
  email: string;

  @Column()
  @IsDefined()
  password: string;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @ManyToOne(() => UserType, (userType) => userType.type_id)
  type: UserType;
}
