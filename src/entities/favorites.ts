import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from './user';
import { Website } from './tool';

@Entity()
export class Favorite {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  website_id: number;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;

  @ManyToOne(() => Website, (website) => website.favorites)
  website: Website;
}
