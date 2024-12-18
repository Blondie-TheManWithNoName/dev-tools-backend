import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ToolService } from './tool.service';
import { CreateToolDTO } from './dtos/create-tool';
import { UpdateToolDTO } from './dtos/update-tool';
import { SetStateToolDTO } from './dtos/approve-tool';
import { AuthRequest } from 'src/app.interfaces';
import { UserGuard } from 'src/guards/user.guard';
import { AdminGuard } from 'src/guards/ADMIN.guard';
import { ToolStateEnum } from 'src/enums/tool-state';
import { OptionalUserGuard } from 'src/guards/optUser.guard';
import { GetToolsQueryDTO } from './dtos/get-tools';

@ApiTags('Tools')
@Controller('tools')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  /**
   * Get all tools
   * [GET] /tools
   */
  @Get()
  @ApiOperation({ summary: 'Get all tools' })
  async getAllTools(
    @Req() _req: Request,
    @Res() res: Response,
    @Query() query: GetToolsQueryDTO,
  ) {
    const response = await this.toolService.getAllTools(query);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Get a tool
   * [GET] /tools/:id
   */
  @Get(':id')
  @UseGuards(OptionalUserGuard)
  @ApiOperation({ summary: 'Get a tool' })
  async getTool(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.toolService.getTool(id, req.user);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Creates a new tool
   * [POST] /tools
   */

  @Post()
  @ApiOperation({ summary: 'Creates a new tool' })
  @UseGuards(UserGuard)
  async createTool(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Body() body: CreateToolDTO,
  ) {
    const data = body;
    const response = await this.toolService.createTool(data, req.user);
    res.status(response.httpStatus).json(response);
  }
  /**
   * Updates a tool
   * [PUT] /tools/:id
   */
  @Put(':id')
  @ApiOperation({ summary: 'Updates a tool' })
  @UseGuards(UserGuard)
  async updateTool(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateToolDTO,
  ) {
    const data = { id: id, valid: false, ...body };
    const response = await this.toolService.updateTool(data, req.user);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Set a tool state
   * [PUT] /tools/:id/state
   */
  @Put(':id/state')
  @ApiOperation({ summary: 'Approves or dispproves a tool' })
  @UseGuards(UserGuard) //, AdminGuard)
  async setStateTool(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SetStateToolDTO,
  ) {
    const data = { id: id, ...body };
    const response = await this.toolService.setStateTool(data, req.user);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Deletes a tool
   * [DELETE] /tools/:id
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a tool' })
  @UseGuards(UserGuard, AdminGuard)
  async deleteTool(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const response = await this.toolService.deleteTool(id);
    res.status(response.httpStatus).json(response);
  }

  //#region TAGS
  /**
   * Get tool tags
   * [GET] /tools/:id/tags
   */
  // @Post(':id/tags')
  // @ApiOperation({ summary: 'Get tool tags' })
  // // @UseGuards(UserGuard)
  // async getTags(
  //   @Req() req: AuthRequest,
  //   @Res() res: Response,
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<void> {
  //   const data = { id };
  //   const response = await this.toolService.getTags(data, req.user);
  //   res.status(response.httpStatus).json(response);
  // }

  /**
   * Adds a tag
   * [POST] /tools/:id/tags/:id
   */
  @Post(':id/tags/:tagId')
  @ApiOperation({ summary: 'Add tag to tool' })
  @UseGuards(UserGuard)
  async addTag(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ): Promise<void> {
    const data = { id, tagId };
    console.log('YES');
    const response = await this.toolService.addTag(data, req.user);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Removes a tag from a tool
   * [DELETE] /tools/:id/tags/:id
   */
  @Delete(':id/tags/:tagId')
  @ApiOperation({ summary: 'Add tag to tool' })
  @UseGuards(UserGuard)
  async removeTag(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ): Promise<void> {
    const data = { id, tagId };
    const response = await this.toolService.removeTag(data, req.user);
    res.status(response.httpStatus).json(response);
  }
}
