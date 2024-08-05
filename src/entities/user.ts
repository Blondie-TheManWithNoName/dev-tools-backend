import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Favorite } from './favorites';
import { IsDefined } from 'class-validator';

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
}
