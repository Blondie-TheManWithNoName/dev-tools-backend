import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { AuthResponse } from './auth.interface';
// import { JsonWebTokenError, JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // private jwtService: JwtService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const emailLowerCase = email.toLocaleLowerCase();
      const passwordSalted = this.getSaltedPassword(password);
      const user = await this.cache.getUser(emailLowerCase, passwordSalted);
      if (!user) throw new UnauthorizedException();
      if (user.expiryDate && user.expiryDate < dayjs().unix())
        throw new UnauthorizedException();

      const payload = {
        iat: dayjs().unix(),
        exp: dayjs().add(5, 'day').unix(),
        sub: 'user',
        id: user.id,
      };

      return {
        httpStatus: HttpStatus.OK,
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else if (error instanceof CacheError)
        throw new ConflictException(
          'Conflict',
          'Please contact Waapiti support for resolution',
        );
      else throw new InternalServerErrorException();
    }
  }

  async validateToken(auth: string, secret: string = undefined) {
    const bearer = auth.split(' ')[0] === 'Bearer';

    if (bearer) {
      const token = auth.split(' ')[1];
      try {
        await this.jwtService.verifyAsync(token, { secret: secret });
        const decoded = await this.jwtService.decode(token);
        return decoded;
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          if (error.message === 'jwt expired')
            throw new ForbiddenException('Invalid token', 'Token has expired');
          else throw new ForbiddenException('Invalid token');
        } else throw new InternalServerErrorException();
      }
    } else
      throw new ForbiddenException(
        'Invalid token',
        'Provided token is not a Bearer Token',
      );
  }

  async decodeBearerToken(auth: string) {
    const token = auth.split(' ')[1];
    return await this.jwtService.decode(token);
  }

  async validateUser(id: number): Promise<UserCache> {
    return await this.cache.getById(id);
  }

  // Encrypt Password
  private getSaltedPassword(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }
}
