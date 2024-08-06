import { Request } from 'express';
import { User } from './entities/user';

export interface AuthRequest extends Request {
  /** User of the request */
  readonly user: User;
}
