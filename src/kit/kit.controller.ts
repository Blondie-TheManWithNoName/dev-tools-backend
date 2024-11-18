import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { GetToolsQueryDTO } from 'src/tool/dtos/get-tools';
import { Response } from 'express';
import { KitService } from './kit.service';
import { AuthRequest } from 'src/app.interfaces';
import { GetKitData, GetKitParams } from './interfaces/get-kit.interface';
import {
  CreateKitBody,
  CreateKitData,
} from './interfaces/create-kit.interface';
import { CreateKitBodyDTO } from './dtos/create-kit.dto';
import { GetKitsData, GetKitsQuery } from './interfaces/get-kits.interface';
import { AddToolBodyDTO } from './dtos/add-tool.dto';
import { AddToolData } from './interfaces/add-tool.interface';
import {
  RemoveToolBody,
  RemoveToolData,
} from './interfaces/remove-tool.interface';
import { UserGuard } from 'src/guards/user.guard';
import { RemoveToolBodyDTO } from './dtos/remove-tool.dto';

@Controller('kits')
export class KitController {
  constructor(private readonly kitService: KitService) {}

  /**
   * Get all kits
   * [GET] /kits
   */
  @Get()
  @ApiOperation({ summary: 'Get all kits' })
  async getAllKits(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Query() query: GetKitsQuery,
  ) {
    const data: GetKitsData = { ...query };
    const response = await this.kitService.getAllKits(data, req.user);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Get a kit
   * [GET] /kits/:id
   */
  @Get(':kitId')
  @ApiOperation({ summary: 'Get a kit' })
  async getKit(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param() params: GetKitParams,
  ) {
    const data: GetKitData = { ...params };
    const response = await this.kitService.getKit(data, req.user);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Create a kit
   * [POST] /kits
   */
  @Post()
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Create a kit' })
  async cerateKit(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Body() body: CreateKitBodyDTO,
  ) {
    const data: CreateKitData = { ...body };
    const response = await this.kitService.createKit(data, req.user);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Add Tool to a kit
   * [PUT] /kits
   */
  @Put('add')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Add tool to a kit' })
  async addTool(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Body() body: AddToolBodyDTO,
  ) {
    const data: AddToolData = { ...body };
    const response = await this.kitService.addTool(data, req.user);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Remove Tool from a kit
   * [PUT] /kits
   */
  @Put('remove')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Add tool to a kit' })
  async removeTool(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Body() body: RemoveToolBodyDTO,
  ) {
    const data: RemoveToolData = { ...body };
    const response = await this.kitService.removeTool(data, req.user);
    res.status(response.httpStatus).json(response);
  }
}
