import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDTO } from './dtos/create-user';
import { UpdateUserDTO } from './dtos/update-user';

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
    @Param('id') id: number,
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
  @Post(':id')
  async updateTool(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id') id: number,
    @Body() body: UpdateUserDTO,
  ) {
    const data = { user_id: id, ...body };
    const response = await this.userService.updateTool(data);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Deletes a user
   * [DELETE] /users/:id
   */
  @Delete(':id')
  async deleteUser(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<void> {
    const response = await this.userService.deleteUser(id);
    res.status(response.httpStatus).json(response);
  }
}
