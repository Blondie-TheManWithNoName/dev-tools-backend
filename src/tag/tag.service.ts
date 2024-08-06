import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag';
import { Tool } from 'src/entities/tool';
import { Repository } from 'typeorm';
import { CreateTag } from './interfaces/create-tag';
import { UpdateTag } from './interfaces/update-tag';
import { UpdateTagDTO } from './dtos/update-tag';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagsRepo: Repository<Tag>,
    @InjectRepository(Tool) private readonly toolsRepo: Repository<Tool>,
  ) {}
  async getAllTags() {
    const [tags, count] = await this.tagsRepo.findAndCount();

    return {
      httpStatus: HttpStatus.OK,
      count: count,
      tags: tags,
    };
  }
  async getTag(id: number) {
    const tag = await this.tagsRepo.findOneBy({ id: id });
    if (tag) {
      return {
        httpStatus: HttpStatus.OK,
        tag: tag,
      };
    } else throw new NotFoundException();
  }
  async createTag(data: CreateTag) {
    const tool = await this.tagsRepo.save(data);
    return {
      httpStatus: HttpStatus.OK,
      message: 'Success!',
      tool: tool,
    };
  }

  async updateTag(data: UpdateTag) {
    const tool = await this.tagsRepo.save(data);
    if (tool) {
      return {
        httpStatus: HttpStatus.OK,
        message: 'Success!',
        tool: tool,
      };
    } else throw new NotFoundException();
  }

  async addTagToTool(data: any) {
    const tag = await this.tagsRepo.findOne(data.tagId);
    if (!tag) {
      return { httpStatus: 404, message: 'Tag not found' };
    }

    const tool = await this.toolsRepo.findOne(data.toolId, {
      relations: ['tags'],
    });
    if (!tool) {
      return { httpStatus: 404, message: 'Tool not found' };
    }

    if (!tool.tags) {
      tool.tags = [];
    }

    if (!tool.tags.some((existingTag) => existingTag.tag_id === data.tagId)) {
      tool.tags.push(tag);
      await this.toolsRepo.save(tool);
    }

    return { httpStatus: 200, message: 'Tag added to tool', tool };
  }

  async deleteTool(id: number) {
    const tool = await this.tagsRepo.delete({ tool_id: id });

    if (tool) {
      return {
        httpStatus: HttpStatus.OK,
        tool: tool,
      };
    } else throw new NotFoundException();
  }
}
