import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user';
import { CreateUser } from './interfaces/create-user';
import { UpdateUser } from './interfaces/update-user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async getAllUsers() {
    const [users, count] = await this.userRepo.findAndCount();

    return {
      httpStatus: HttpStatus.OK,
      count: count,
      users: users,
    };
  }
  async getUser(id: number) {
    const user = await this.userRepo.findOneBy({ user_id: id });
    if (user) {
      return {
        httpStatus: HttpStatus.OK,
        user: user,
      };
    } else throw new NotFoundException();
  }

  async createUser(data: CreateUser) {
    const user = await this.userRepo.save(data);
    return {
      httpStatus: HttpStatus.OK,
      message: 'Success!',
      user: user,
    };
  }

  async updateUser(data: UpdateUser) {
    const user = await this.userRepo.save(data);
    if (user) {
      return {
        httpStatus: HttpStatus.OK,
        message: 'Success!',
        user: user,
      };
    } else throw new NotFoundException();
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.delete({ user_id: id });

    if (user) {
      return {
        httpStatus: HttpStatus.OK,
        user: user,
      };
    } else throw new NotFoundException();
  }
}
