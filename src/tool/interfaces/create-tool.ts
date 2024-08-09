import { Favorite } from 'src/entities/favorites';
import { User } from 'src/entities/user';

export interface CreateTool {
  /** Title */
  title: string;
  /** URL */
  url: string;
  /** Description */
  description: string;
}
