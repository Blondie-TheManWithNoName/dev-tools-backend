import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user';
import { CreateUser } from './interfaces/create-user';
import { UpdateUser } from './interfaces/update-user';
import { Tool } from 'src/entities/tool';
import { Favorite } from 'src/entities/favorites';
import { getSaltedPassword } from 'src/app.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Tool) private readonly toolRepo: Repository<Tool>,
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
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
    const userExist = await this.userRepo.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });
    if (!userExist) {
      data.password = getSaltedPassword(data.password);
      const user = await this.userRepo.save(data);
      return {
        httpStatus: HttpStatus.OK,
        message: 'Success!',
        user: user,
      };
    } else throw new ConflictException('User alredy exists');
  }

  async updateUser(data: UpdateUser, user) {
    if (user.user_id === data.user_id) {
      const userExist = await this.userRepo.findOneBy({
        user_id: data.user_id,
      });
      if (userExist) {
        if (data.password) data.password = getSaltedPassword(data.password);
        const user = await this.userRepo.save(data);
        if (user) {
          return {
            httpStatus: HttpStatus.OK,
            message: 'Success!',
            user: user,
          };
        }
      } else throw new NotFoundException();
    } else
      throw new UnauthorizedException(
        'User not authorized to delete this favorite',
      );
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.delete({ user_id: id });
    if (user.affected > 0) {
      return {
        httpStatus: HttpStatus.OK,
        message: 'Deleted!',
        user: user,
      };
    } else throw new NotFoundException('User nor found');
  }

  //#region FAVORITES

  async getFavorites(id: number) {
    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (user) {
      const [favorites, count] = await this.favoriteRepo.findAndCount({
        where: { user: { user_id: id } },
      });

      return {
        httpStatus: HttpStatus.OK,
        favorites: favorites,
        count: count,
      };
    } else throw new NotFoundException('User not found');
  }

  async addFavorite(data, user) {
    if (user.user_id === data.user_id) {
      const userCheck = await this.userRepo.findOneBy({
        user_id: data.user_id,
      });
      if (userCheck) {
        const tool = await this.toolRepo.findOneBy({ tool_id: data.toolId });
        if (tool) {
          console.log('data', data);
          const favorite = await this.favoriteRepo.save({ user, tool });
          return {
            httpStatus: HttpStatus.OK,
            message: 'Added!',
            favorite: favorite,
          };
        } else throw new NotFoundException('Tool not found');
      } else throw new NotFoundException('User not found');
    } else
      throw new UnauthorizedException(
        'User not authorized to delete this favorite',
      );
  }
}
