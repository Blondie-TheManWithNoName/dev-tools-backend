import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user';
import { Tool } from './tool';
import { IsDefined } from 'class-validator';

@Entity()
@Unique(['user', 'tool'])
export class Favorite {
  @PrimaryGeneratedColumn()
  @IsDefined()
  fav_id: number;

  @ManyToOne(() => User, (user) => user.favorites)
  @IsDefined()
  user: User;

  @ManyToOne(() => Tool, (tool) => tool.favorites)
  @IsDefined()
  tool: Tool;
}
