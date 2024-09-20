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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'List tags' })
  async getAllTags(@Req() _req: Request, @Res() res: Response) {
    const response = await this.tagService.getAllTags();
    res.status(response.httpStatus).json(response);
  }

  /**
   * Get a tag
   * [GET] /tags/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'List tags' })
  async getTag(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.tagService.getTag(id);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Creates a new tag
   * [POST] /tags
   */
  @Post()
  @ApiOperation({ summary: 'Creates a new tag' })
  async createTag(
    @Req() _req: Request,
    @Res() res: Response,
    @Body() body: CreateTagDTO,
  ) {
    const response = await this.tagService.createTag(body);
    res.status(response.httpStatus).json(response);
  }
  /**
   * Updates a tag
   * [PUT] /tags/:id
   */
  @Put(':id')
  @ApiOperation({ summary: 'Updates a tag' })
  async updateTag(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTagDTO,
  ) {
    const data = { id: id, ...body };
    const response = await this.tagService.updateTag(data);
    res.status(response.httpStatus).json(response);
  }

  /**
   * Deletes a tag
   * [DELETE] /tags/:id
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a tag' })
  async deleteTag(
    @Req() _req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const response = await this.tagService.deleteTag(id);
    res.status(response.httpStatus).json(response);
  }
}
