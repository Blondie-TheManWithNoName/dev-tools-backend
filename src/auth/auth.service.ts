import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { AuthResponse } from './auth.interface';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { getSaltedPassword } from 'src/app.utils';
import { UserTypeEnum } from 'src/enums/user-type';
// import { JsonWebTokenError, JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const emailLowerCase = email.toLocaleLowerCase();
      const passwordSalted = getSaltedPassword(password);
      const user = await this.usersRepo.findOneBy({
        email: emailLowerCase,
        password: passwordSalted,
      });
      if (!user) throw new UnauthorizedException();
      const payload = {
        iat: dayjs().unix(),
        exp: dayjs().add(5, 'day').unix(),
        sub: 'user',
        id: user.user_id,
      };
      return {
        httpStatus: HttpStatus.OK,
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new InternalServerErrorException();
    }
  }

  async validateToken(auth: string) {
    const bearer = auth.split(' ')[0] === 'Bearer';

    if (bearer) {
      const token = auth.split(' ')[1];
      try {
        await this.jwtService.verifyAsync(token);
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

  async validateUser(id: number) {
    return await this.usersRepo.findOneBy({ user_id: id });
  }

  async validateAdmin(id: number): Promise<boolean> {
    const user = await this.usersRepo.findOneBy({ user_id: id });
    return user.type.type_id === UserTypeEnum.admin ? true : false;
  }
}
