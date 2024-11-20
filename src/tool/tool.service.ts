import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTool } from './interfaces/create-tool';
import { InjectRepository } from '@nestjs/typeorm';
import { Tool } from 'src/entities/tool';
import { Brackets, In, Repository } from 'typeorm';
import { UpdateToolInfo } from './interfaces/update-tool';
import { SetStateTool } from './interfaces/approve-tool';
import { ToolStateEnum } from 'src/enums/tool-state';
import { User } from 'src/entities/user';
import { ProcessTool } from 'src/entities/process_tool';
import { ToolInfo } from 'src/entities/tool_info';
import { UserTypeEnum } from 'src/enums/user-type';
import { Tag } from 'src/entities/tag';
import { ToolFilters } from './dtos/get-tools';
import { ToolDTO } from './dtos/tool.dto';

@Injectable()
export class ToolService {
  constructor(
    @InjectRepository(Tool) private toolsRepo: Repository<Tool>,
    @InjectRepository(ToolInfo)
    private readonly toolsInfoRepo: Repository<ToolInfo>,
    @InjectRepository(ProcessTool)
    private readonly processToolRepo: Repository<ProcessTool>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}
  async getAllTools(data: ToolFilters) {
    const { tags, page, take } = data;
    const states = [
      Object.keys(ToolStateEnum).indexOf(ToolStateEnum.APPROVED) + 1,
      Object.keys(ToolStateEnum).indexOf(ToolStateEnum.UPDATED) + 1,
    ];

    const query = this.toolsRepo
      .createQueryBuilder('tool')
      .leftJoinAndSelect('tool.toolInfos', 'toolInfos')
      .leftJoinAndSelect('toolInfos.tags', 'tags')
      .where('tool.state IN(:states)', { states })
      .andWhere('toolInfos.valid = true');

    //FILTERS
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'tags':
          query.andWhere('tags.name IN(:...tags)', { tags });
          break;
        // Pagination
        case 'page':
          const skip = (page - 1) * (take ? take : 0);
          if (skip) query.skip(skip);
          break;
        case 'take':
          query.take(Number(take));
          break;
      }
    });

    const [tools, count] = await query.getManyAndCount();

    const procTools = tools.map((tool) => new ToolDTO(tool));

    return {
      httpStatus: HttpStatus.OK,
      count: count,
      tools: procTools,
    };
  }

  async getTool(id: number, user: User) {
    const tool = await this.toolsInfoRepo
      .createQueryBuilder('toolInfo')
      .leftJoinAndSelect('toolInfo.tool', 'tool')
      .leftJoinAndSelect('toolInfo.tags', 'tags')
      .where('toolInfo.id = :id', { id })
      .andWhere('toolInfo.valid = :valid', { valid: true })
      .andWhere(
        new Brackets((qb) => {
          if (user !== undefined && user.type === UserTypeEnum.ADMIN) {
            return;
          } else {
            qb.where('tool.state.state_id IN (:...states)', {
              states: [ToolStateEnum.APPROVED, ToolStateEnum.UPDATED],
            }).orWhere('tool.posted_by.user_id = :user_id', {
              user_id: user?.user_id,
            });
          }
        }),
      )
      .getOne();

    if (tool) {
      return {
        httpStatus: HttpStatus.OK,
        tool: tool,
      };
    } else throw new NotFoundException();
  }

  async createTool(data: CreateTool, user) {
    try {
      const tool: Tool = await this.toolsRepo.save({
        posted_by: user,
        state:
          user.type.type_id === UserTypeEnum.ADMIN
            ? ToolStateEnum.APPROVED
            : ToolStateEnum.PENDING,
      });

      const toolInfo = await this.toolsInfoRepo.save({
        id: tool.id,
        valid: true,
        ...data,
      });
      await this.toolsInfoRepo.save({
        id: tool.id,
        valid: false,
        ...data,
      });
      return {
        httpStatus: HttpStatus.OK,
        message: 'Success!',
        tool: tool,
        toolInfo: toolInfo,
      };
    } catch (error) {
      console.log('error', error);
      if (error.code === 'ER_DUP_ENTRY')
        throw new ConflictException('Duplicated tool');
      else throw error;
    }
  }

  async updateTool(data: UpdateToolInfo, user: User) {
    const tool = await this.toolsRepo.findOne({
      where: { id: data.id },
      relations: ['posted_by'],
    });
    if (tool) {
      // Change tool status
      await this.toolsRepo.save({
        id: data.id,
        state: ToolStateEnum.UPDATED,
      });

      // Generate process data
      const processData = {
        tool: tool,
        prev_state: tool.state,
        state: ToolStateEnum.UPDATED,
        // message: data.message,
        processed_by: user,
        processed_time: new Date(),
      };
      const processed = await this.processToolRepo.save(processData);
      const newTool = await this.toolsInfoRepo.save(data);

      return {
        httpStatus: HttpStatus.OK,
        message: 'Success!',
        tool: newTool,
      };
    } else throw new NotFoundException();
  }

  async setStateTool(data: SetStateTool, user: User) {
    const oldTool = await this.toolsRepo.findOne({
      where: { id: data.id },
      relations: ['posted_by'],
    });
    if (oldTool) {
      // Change tool status
      await this.toolsRepo.save({
        id: data.id,
        state: data.state,
      });

      // Generate process data
      const processData = {
        tool: oldTool,
        prev_state: oldTool.state,
        state: data.state,

        processed_by: user,
        processed_time: new Date(),
      };
      const process = await this.processToolRepo.save(processData);

      if (
        oldTool.state === ToolStateEnum.UPDATED &&
        data.state === ToolStateEnum.APPROVED
      ) {
        const upadtedToolInfo = await this.toolsInfoRepo.findBy({
          id: data.id,
        });

        if (upadtedToolInfo[0].valid) {
          const { valid, ...info } = upadtedToolInfo[1];
          await this.toolsInfoRepo.save({ ...info, valid: true });
        } else if (upadtedToolInfo[1].valid) {
          const { valid, ...info } = upadtedToolInfo[0];
          await this.toolsInfoRepo.save({ ...info, valid: true });
        }
      }

      return {
        httpStatus: HttpStatus.OK,
        message: 'Success!',
        // tool: tool,
        process: process,
      };
    } else throw new NotFoundException();
  }

  async deleteTool(id: number) {
    const tool = await this.toolsRepo.delete({ id: id });

    if (tool) {
      return {
        httpStatus: HttpStatus.OK,
        tool: tool,
      };
    } else throw new NotFoundException();
  }

  //#region TAG

  async addTag(data, user) {
    const toolInfo = await this.toolsInfoRepo
      .createQueryBuilder('toolInfo')
      .leftJoinAndSelect('toolInfo.tool', 'tool')
      .leftJoinAndSelect('toolInfo.tags', 'tags')
      .where('toolInfo.id = :id', { id: data.id })
      .andWhere('toolInfo.valid = :valid', { valid: true })
      .andWhere(
        new Brackets((qb) => {
          if (user.type?.type_id === UserTypeEnum.ADMIN) {
            return;
          } else {
            qb.where('tool.posted_by.user_id = :user_id', {
              user_id: user?.user_id,
            });
          }
        }),
      )
      .getOne();

    if (!toolInfo) throw new NotFoundException(`Tool not found`);

    // Fetch the Tag entity
    const tag = await this.tagRepo.findOne({ where: { id: data.tagId } });
    if (!tag) throw new NotFoundException(`Tag not found`);

    // Add the Tag to ToolInfo's tags array if it's not already added
    if (!toolInfo.tags.find((existingTag) => existingTag.id === tag.id)) {
      toolInfo.tags.push(tag);
      this.toolsInfoRepo.save(toolInfo);
    } else throw new ConflictException(`Tag already added`);

    return {
      httpStatus: HttpStatus.OK,
      message: 'Success!',
      tag: tag,
    };
  }

  async removeTag(data, user) {
    const toolInfo = await this.toolsInfoRepo
      .createQueryBuilder('toolInfo')
      .leftJoinAndSelect('toolInfo.tool', 'tool')
      .leftJoinAndSelect('toolInfo.tags', 'tags')
      .where('toolInfo.id = :id', { id: data.id })
      .andWhere('toolInfo.valid = :valid', { valid: true })
      .andWhere(
        new Brackets((qb) => {
          if (user.type?.type_id === UserTypeEnum.ADMIN) {
            return;
          } else {
            qb.where('tool.posted_by.user_id = :user_id', {
              user_id: user?.user_id,
            });
          }
        }),
      )
      .getOne();

    if (!toolInfo) throw new NotFoundException(`Tool not found`);

    // Fetch the Tag entity
    const tag = await this.tagRepo.findOne({ where: { id: data.tagId } });
    if (!tag) throw new NotFoundException(`Tag not found`);

    const index = toolInfo.tags.findIndex((t) => t.id === tag.id);
    toolInfo.tags.splice(index, 1);

    if (index === -1) this.toolsInfoRepo.save(toolInfo);

    return {
      httpStatus: HttpStatus.OK,
      message: 'Success!',
      tag: tag,
    };
  }
}
