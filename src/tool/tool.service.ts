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
import { ToolState } from 'src/entities/tool_state';
import { ProcessTool } from 'src/entities/process_tool';
import { ToolInfo } from 'src/entities/tool_info';
import { UserTypeEnum } from 'src/enums/user-type';
import { Tag } from 'src/entities/tag';

@Injectable()
export class ToolService {
  constructor(
    @InjectRepository(Tool) private toolsRepo: Repository<Tool>,
    @InjectRepository(ToolInfo)
    private readonly toolsInfoRepo: Repository<ToolInfo>,
    @InjectRepository(ToolState)
    private readonly toolStateRepo: Repository<ToolState>,
    @InjectRepository(ProcessTool)
    private readonly processToolRepo: Repository<ProcessTool>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}
  async getAllTools() {
    const [tools, count] = await this.toolsInfoRepo.findAndCount({
      select: {
        tool_id: true,
        title: true,
        url: true,
        description: true,
        tags: true,
      },
      where: {
        valid: true,
        tool: {
          state: {
            state_id: In([ToolStateEnum.approved, ToolStateEnum.updated]),
          },
        },
      },
      relations: ['tool', 'tags'],
    });

    return {
      httpStatus: HttpStatus.OK,
      count: count,
      tools: tools,
    };
  }

  async getTool(id: number, user) {
    const tool = await this.toolsInfoRepo
      .createQueryBuilder('toolInfo')
      .leftJoinAndSelect('toolInfo.tool', 'tool')
      .leftJoinAndSelect('toolInfo.tags', 'tags')
      .where('toolInfo.tool_id = :id', { id })
      .andWhere('toolInfo.valid = :valid', { valid: true })
      .andWhere(
        new Brackets((qb) => {
          if (user !== undefined && user.type?.type_id === UserTypeEnum.admin) {
            return;
          } else {
            qb.where('tool.state.state_id IN (:...states)', {
              states: [ToolStateEnum.approved, ToolStateEnum.updated],
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
      const tool = await this.toolsRepo.save({
        posted_by: user,
        state: await this.toolStateRepo.findOneBy({
          state_id:
            user.type.type_id === UserTypeEnum.admin
              ? ToolStateEnum.approved
              : ToolStateEnum.pending,
        }),
      });

      const toolInfo = await this.toolsInfoRepo.save({
        tool_id: tool.tool_id,
        valid: true,
        ...data,
      });
      await this.toolsInfoRepo.save({
        tool_id: tool.tool_id,
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
      if (error.code === 'ER_DUP_ENTRY')
        throw new ConflictException('Duplicated tool');
      else throw error;
    }
  }

  async updateTool(data: UpdateToolInfo, user: User) {
    const tool = await this.toolsRepo.findOne({
      where: { tool_id: data.tool_id },
      relations: ['state', 'posted_by', 'favorites'],
    });
    if (tool) {
      // Change tool status
      await this.toolsRepo.save({
        tool_id: data.tool_id,
        state: await this.toolStateRepo.findOneBy({
          state_id: ToolStateEnum.updated,
        }),
      });

      // Generate process data
      const processData = {
        tool: tool,
        prev_state: tool.state,
        state: await this.toolStateRepo.findOneBy({
          state_id: ToolStateEnum.updated,
        }),
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

  async setStateTool(data: SetStateTool, user) {
    const oldTool = await this.toolsRepo.findOne({
      where: { tool_id: data.tool_id },
      relations: ['state', 'posted_by', 'favorites'],
    });
    if (oldTool) {
      // Change tool status
      await this.toolsRepo.save({
        tool_id: data.tool_id,
        state: await this.toolStateRepo.findOneBy({
          state_id: data.state,
        }),
      });

      // Generate process data
      const processData = {
        tool: oldTool,
        prev_state: oldTool.state,
        state: await this.toolStateRepo.findOneBy({
          state_id: data.state,
        }),
        processed_by: user,
        processed_time: new Date(),
      };
      const process = await this.processToolRepo.save(processData);

      if (
        oldTool.state.state_id === ToolStateEnum.updated &&
        data.state === ToolStateEnum.approved
      ) {
        const upadtedToolInfo = await this.toolsInfoRepo.findBy({
          tool_id: data.tool_id,
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
    const tool = await this.toolsRepo.delete({ tool_id: id });

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
      .where('toolInfo.tool_id = :id', { id: data.id })
      .andWhere('toolInfo.valid = :valid', { valid: true })
      .andWhere(
        new Brackets((qb) => {
          if (user.type?.type_id === UserTypeEnum.admin) {
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
    const tag = await this.tagRepo.findOne({ where: { tag_id: data.tagId } });
    if (!tag) throw new NotFoundException(`Tag not found`);

    // Add the Tag to ToolInfo's tags array if it's not already added
    if (
      !toolInfo.tags.find((existingTag) => existingTag.tag_id === tag.tag_id)
    ) {
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
      .where('toolInfo.tool_id = :id', { id: data.id })
      .andWhere('toolInfo.valid = :valid', { valid: true })
      .andWhere(
        new Brackets((qb) => {
          if (user.type?.type_id === UserTypeEnum.admin) {
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
    const tag = await this.tagRepo.findOne({ where: { tag_id: data.tagId } });
    if (!tag) throw new NotFoundException(`Tag not found`);

    const index = toolInfo.tags.findIndex((t) => t.tag_id === tag.tag_id);
    toolInfo.tags.splice(index, 1);

    if (index === -1) this.toolsInfoRepo.save(toolInfo);

    return {
      httpStatus: HttpStatus.OK,
      message: 'Success!',
      tag: tag,
    };
  }
}
