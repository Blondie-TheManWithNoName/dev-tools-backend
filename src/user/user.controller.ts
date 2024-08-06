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
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDTO } from './dtos/create-user';
import { UpdateUserDTO } from './dtos/update-user';
import { AddFavoriteDTO } from './dtos/add-favorite';
import { UserGuard } from 'src/guards/user.guard';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users
   * [GET] /users
   */
  @Get()
  async getAllUsers(@Req() _req: Request, @Res() res: Response) {
    const response = await this.userService.getAllUsers();
    res.status(response.httpStatus).json(response);
  }

  /**
   * Get a user
   * [GET] /users/:id
   */
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
  async createUser(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() body: CreateUserDTO,
  ) {
    const response = await this.userService.createUser(body);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Updates a  tool
   * [PUT] /tool
   */
  @Put(':id')
  @UseGuards(UserGuard)
  async updateTool(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDTO,
  ) {
    const data = { user_id: id, ...body };
    const response = await this.userService.updateUser(data);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Deletes a user
   * [DELETE] /users/:id
   */
  @Delete(':id')
  @UseGuards(UserGuard)
  async deleteUser(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const response = await this.userService.deleteUser(id);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Gets user favorites
   * [GET] /users/:id/favorites
   */
  @Get(':id/favorites')
  async getFavorites(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.userService.getFavorites(id);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Adds a favorite
   * [POST] /users/:id/favorites
   */
  @Post(':id/favorites')
  @UseGuards(UserGuard)
  async addFavorite(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddFavoriteDTO,
  ) {
    const data = { user_id: id, ...body };
    const response = await this.userService.addFavorite(data);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Removes a favorite
   * [DELETE] /users/:id/favorites
   */
  @Delete(':id/favorites')
  @UseGuards(UserGuard)
  async removeFavorite(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddFavoriteDTO,
  ) {
    const data = { user_id: id, ...body };
    const response = await this.userService.removeFavorite(data);
    res.status(response.httpStatus).json(response);
  }
}
