import { Request } from 'express';
import { User } from './entities/user';

export interface AuthRequest extends Request {
  /** User of the request */
  readonly user: User;
}

export interface QueryFilters {
  /** Number of page */
  page: number;
  /** Number of elements per page */
  take: number;
  /** Search */
  search: string;
  /** Order Direction */
  orderDir: boolean;
}
