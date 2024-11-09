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
import { ToolInfo } from 'src/entities/tool_info';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ToolInfo)
    private readonly toolInfoRepo: Repository<ToolInfo>,
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

  async updateUser(data: UpdateUser, user: User) {
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
        relations: ['tool'],
      });

      return {
        httpStatus: HttpStatus.OK,
        favorites: favorites,
        count: count,
      };
    } else throw new NotFoundException('User not found');
  }

  async getFavorite(id: number, toolId: number) {
    const user = await this.userRepo.findOne({ where: { user_id: id } });
    const tool = await this.toolRepo.findOne({ where: { id: toolId } });

    if (!user) throw new NotFoundException('User not found');
    if (!tool) throw new NotFoundException('Tool not found');

    const favorite = await this.favoriteRepo.findOne({
      where: { user: { user_id: id }, tool: { id: toolId } },
    });

    if (!favorite) throw new NotFoundException('Favorite not found');

    return {
      httpStatus: HttpStatus.OK,
      favorite: favorite,
    };
  }

  async addFavorite(data, user: User) {
    if (user.user_id !== data.user_id) {
      throw new UnauthorizedException(
        'User not authorized to add this favorite',
      );
    }

    const toolInfo = await this.toolInfoRepo.findOne({
      where: { id: data.toolId },
      relations: ['tool'],
    });
    if (!toolInfo) {
      throw new NotFoundException('Tool not found');
    }

    // Increment numFavorites with an atomic operation if possible, otherwise save the incremented count
    toolInfo.tool.numFavorites += 1;
    await this.toolRepo.save(toolInfo.tool);

    const favorite = await this.favoriteRepo.save({
      user,
      tool: toolInfo,
    });

    return {
      httpStatus: HttpStatus.OK,
      message: 'Added!',
      favorite,
      updatedTool: toolInfo.tool, // Optional: include updated tool information
    };
  }

  async followUser(user: User, targetUserId: number) {
    const targetUser = await this.userRepo.findOneBy({ user_id: targetUserId });
    if (!targetUser) throw new NotFoundException('User not found');

    user.following.push(targetUser);
    targetUser.followers.push(user);

    // Update counts
    user.followingCount++;
    targetUser.followerCount++;

    await this.userRepo.save([user, targetUser]);

    return {
      httpStatus: HttpStatus.OK,
      following: user.followingCount,
      followedUser: targetUser,
    };
  }

  async unfollowUser(user: User, targetUserId: number) {
    const targetUser = await this.userRepo.findOneBy({ user_id: targetUserId });
    if (!targetUser) throw new NotFoundException('User not found');

    user.following = user.following.filter(
      (u) => u.user_id !== targetUser.user_id,
    );
    targetUser.followers = targetUser.followers.filter(
      (u) => u.user_id !== user.user_id,
    );

    // Update counts
    user.followingCount--;
    targetUser.followerCount--;

    await this.userRepo.save([user, targetUser]);

    return {
      httpStatus: HttpStatus.OK,
      unfollowing: user.followingCount,
      unfollowedUser: targetUser,
    };
  }
}
