import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDTO } from './dtos/create-user';
import { UpdateUserDTO } from './dtos/update-user';
import { UserGuard } from 'src/guards/user.guard';
import { AuthRequest } from 'src/app.interfaces';
import { AdminGuard } from 'src/guards/ADMIN.guard';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users
   * [GET] /users
   */
  @ApiOperation({ summary: 'List users' })
  @Get()
  async getAllUsers(@Req() _req: Request, @Res() res: Response) {
    const response = await this.userService.getAllUsers();
    res.status(response.httpStatus).json(response);
  }

  /**
   * Get a user
   * [GET] /users/:id
   */
  @ApiOperation({ summary: 'Get a users' })
  @Get(':id')
  async getUser(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log('id', id);
    const response = await this.userService.getUser(id);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Creates a new user
   * [POST] /users
   */
  @Post()
  @ApiOperation({ summary: 'Create a user' })
  async createUser(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() body: CreateUserDTO,
  ) {
    const response = await this.userService.createUser(body);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Updates a user
   * [PUT] /user/:id
   */
  @Put(':id')
  @ApiOperation({ summary: 'Updates a user' })
  @UseGuards(UserGuard)
  async updateTool(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDTO,
  ) {
    const data = { user_id: id, ...body };
    const response = await this.userService.updateUser(data, req.user);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Deletes a user
   * [DELETE] /users/:id
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a user' })
  @UseGuards(UserGuard, AdminGuard)
  async deleteUser(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const response = await this.userService.deleteUser(id);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Gets user kits
   * [GET] /users/:id/kits
   */
  @Get(':id/kits')
  @ApiOperation({ summary: 'Get users kits' })
  async getKits(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) userId: number,
  ) {
    const response = await this.userService.getKits(userId);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Follow
   * [POST] /users/follow/:id
   */
  @Post('follow/:id')
  @ApiOperation({ summary: 'Follow a user' })
  @UseGuards(UserGuard)
  async followUser(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.userService.followUser(req.user, id);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Unfollow
   * [POST] /users/unfollow/:id
   */
  @Post('unfollow/:id')
  @ApiOperation({ summary: 'Unfollow a user' })
  @UseGuards(UserGuard)
  async unfollowUser(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.userService.unfollowUser(req.user, id);
    res.status(response.httpStatus).json(response);
  }
}
