import { User } from 'src/entities/user';

export class UserPreviewDTO {
  id: number;
  username: string;
  avatar: string;

  constructor(user: User) {
    this.id = user.user_id;
    this.username = user.username;
    this.avatar = user.avatar;
  }
}
