import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag';
import { Tool } from 'src/entities/tool';
import { Repository } from 'typeorm';
import { CreateTag } from './interfaces/create-tag';
import { UpdateTag } from './interfaces/update-tag';

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
    const tag = await this.tagsRepo.findOneBy({ tag_id: id });
    if (tag) {
      return {
        httpStatus: HttpStatus.OK,
        tag: tag,
      };
    } else throw new NotFoundException();
  }
  async createTag(data: CreateTag) {
    const tag = await this.tagsRepo.save(data);
    return {
      httpStatus: HttpStatus.OK,
      message: 'Success!',
      tag: tag,
    };
  }

  async updateTag(data: UpdateTag) {
    const tag = await this.tagsRepo.save(data);
    if (tag) {
      return {
        httpStatus: HttpStatus.OK,
        message: 'Success!',
        tag: tag,
      };
    } else throw new NotFoundException();
  }

  async addTagToTool(data: any) {
    const tag = await this.tagsRepo.findOne(data.tagId);
    if (tag) {
      const tool = await this.toolsRepo.findOne({
        where: { tool_id: data.toolId },
        relations: ['tags'],
      });
      if (tool) {
        if (
          !tool.tags.some((existingTag) => existingTag.tag_id === data.tagId)
        ) {
          tool.tags.push(tag);
          await this.toolsRepo.save(tool);
          return {
            httpStatus: HttpStatus.OK,
            message: 'Tag added to tool',
            tool,
          };
        }
      } else throw new NotFoundException('Tool not found');
    } else throw new NotFoundException('Tag not found');
  }

  async deleteTag(id: number) {
    const tag = await this.tagsRepo.delete({ tag_id: id });

    if (tag) {
      return {
        httpStatus: HttpStatus.OK,
        tag: tag,
      };
    } else throw new NotFoundException();
  }
}
