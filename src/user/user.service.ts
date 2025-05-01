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
import { GetKitsQuery } from './interfaces/get-kits';
import { ToolDTO } from 'src/tool/dtos/tool.dto';
import { title } from 'process';

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

  async getKits(id: number, query: GetKitsQuery) {
    const { toolId, view } = query;
    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (user) {
      const [kits, count] = await this.kitRepo.findAndCount({
        where: { owner: { user_id: id } },
        relations: ['tools', 'tools.toolInfos', 'owner'],
      });

      let filteredKits;
      if (view === 'modal') {
        filteredKits = kits.map((kit) => {
          let selected = false;
          // Convert tools and check if the toolId is already in the kit
          const tools = kit.tools.map((tool) => {
            if (toolId && tool.id === toolId) {
              selected = true;
            }
            return tool.id;
          });

          return {
            ...kit,
            selected: toolId !== undefined ? selected : undefined,
            tools,
          };
        });
      } else if (view === 'preview') {
        filteredKits = kits.map((kit) => {
          const icons = kit.tools.map((tool) => {
            const validToolInfo = tool.toolInfos[0].valid
              ? tool.toolInfos[0]
              : tool.toolInfos[1];
            return validToolInfo.faviconPath;
          });

          return {
            id: kit.id,
            title: kit.title,
            owner: kit.owner,
            icons: icons,
          };
        });
      } else
        filteredKits = kits.map((kit) =>
          kit.tools.map((tool) => new ToolDTO(tool)),
        );
      return {
        httpStatus: HttpStatus.OK,
        count,
        kits: filteredKits,
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
