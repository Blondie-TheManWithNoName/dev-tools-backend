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
import { CreateUser } from './interfaces/create-user';
import { UpdateUser } from './interfaces/update-user';
import { Tool } from 'src/entities/tool';
import { getSaltedPassword } from 'src/app.utils';
import { ToolInfo } from 'src/entities/tool_info';
import { Kit } from 'src/entities/kit';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ToolInfo)
    private readonly toolInfoRepo: Repository<ToolInfo>,
    @InjectRepository(Tool) private readonly toolRepo: Repository<Tool>,
    @InjectRepository(Kit)
    private readonly kitRepo: Repository<Kit>,
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
        'User not authorized no update another user',
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

  //#region KITS

  async getKits(id: number) {
    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (user) {
      const [kits, count] = await this.kitRepo.findAndCount({
        where: { owner: { user_id: id } },
        relations: ['tools'],
      });

      return {
        httpStatus: HttpStatus.OK,
        count,
        kits,
      };
    } else throw new NotFoundException('User not found');
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
