import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import dayjs from 'dayjs';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.get('Authorization');

    try {
      if (auth) {
        const payload = await this.authService.validateToken(auth);
        const userId = payload.id;
        if (userId !== undefined) {
          const user = await this.authService.validateUser(userId);
          if (user) {
            request.user = user;
            return true;
          } else throw new ForbiddenException('Invalid User');
        } else throw new ForbiddenException('Invalid token decoded');
      } else {
        throw new ForbiddenException('Missing token');
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }
}
