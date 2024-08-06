import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TagService } from './tag.service';
import { CreateTagDTO } from './dtos/create-tag';
import { UpdateTagDTO } from './dtos/update-tag';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * Get all tags
   * [GET] /tags
   */
  @Get()
  async getAllTags(@Req() _req: Request, @Res() res: Response) {
    const response = await this.tagService.getAllTags();
    res.status(response.httpStatus).json(response);
  }

  /**
   * Get a tag
   * [GET] /tags/:id
   */
  @Get(':id')
  async getTool(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id') name: number,
  ) {
    const response = await this.tagService.getTag(id);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Creates a new tool
   * [POST] /tool
   */
  @Post()
  async createTool(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() body: CreateTagDTO,
  ) {
    const response = await this.tagService.createTag(body);
    res.status(response.httpStatus).json(response);
  }
  /**
   * Updates a tag
   * [PUT] /tool
   */
  @Put(':id')
  async updateTool(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id') id: number,
    @Body() body: UpdateTagDTO,
  ) {
    const data = { id: id, ...body };
    const response = await this.tagService.updateTag(data);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Approves a  tool
   * [PUT] /tag/:id/tool/:id
   */
  @Put(':tagId/tool/:toolId')
  async addTagToTool(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('tagId') tagId: number,
    @Param('toolId') toolId: number,
  ) {
    const data = { tagId, toolId };
    const response = await this.tagService.addTagToTool(data);
    res.status(response.httpStatus).json(response);
  }
  /**
   * Deletes a tool
   * [DELETE] /tools/:id
   */
  @Delete(':id')
  async deleteTool(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<void> {
    const response = await this.tagService.deleteTool(id);
    res.status(response.httpStatus).json(response);
  }
}
