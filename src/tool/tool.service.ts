import {
  BadRequestException,
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
import { FindOptions, ToolFilters } from './dtos/get-tools';
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
  async findTools(
    filters: ToolFilters,
    findOptions: FindOptions,
  ): Promise<Tool[]> {
    const { tags } = filters;
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
    Object.keys(filters).forEach((key) => {
      switch (key) {
        case 'tags':
          query.andWhere('tags.name IN(:...tags)', { tags });
          break;
      }
    });

    // Options
    const { page, take } = findOptions;

    const tools = await query.getMany();

    const procTools = tools.map((tool) => new ToolDTO(tool));
    return tools;
  }

  // ACTUALLY NOT USED FOR NOW
  // async getTool(id: number, user: User) {
  //   const tool = await this.toolsInfoRepo
  //     .createQueryBuilder('toolInfo')
  //     .leftJoinAndSelect('toolInfo.tool', 'tool')
  //     .leftJoinAndSelect('toolInfo.tags', 'tags')
  //     .where('toolInfo.id = :id', { id })
  //     .andWhere('toolInfo.valid = :valid', { valid: true })
  //     .andWhere(
  //       new Brackets((qb) => {
  //         if (user !== undefined && user.type === UserTypeEnum.ADMIN) {
  //           return;
  //         } else {
  //           qb.where('tool.state.state_id IN (:...states)', {
  //             states: [ToolStateEnum.APPROVED, ToolStateEnum.UPDATED],
  //           }).orWhere('tool.posted_by.user_id = :user_id', {
  //             user_id: user?.user_id,
  //           });
  //         }
  //       }),
  //     )
  //     .getOne();

  //   if (tool) {
  //     return {
  //       httpStatus: HttpStatus.OK,
  //       tool: tool,
  //     };
  //   } else throw new NotFoundException();
  // }

  /**
   *
   * @param data - Necessary data to create the Tool
   * @param user - User who makes the request
   * @returns    - The tool created
   */
  async createTool(data: CreateTool, user: User): Promise<Tool> {
    try {
      const { tags, title, url, description } = data;

      const exists = await this.checkUrl(url);
      if (!exists) throw new BadRequestException("URL doesn't exist");

      // Check Tags and Fetch
      const tagsArray = await this.tagRepo.find({ where: { name: In(tags) } });
      if (tags.length !== tagsArray.length)
        throw new NotFoundException(`Tag not found`);

      const tool = new Tool({ user });
      const createdTool: Tool = await this.toolsRepo.save(tool);

      // // Add the Tag to ToolInfo's tags array if it's not already added
      // if (!toolInfo.tags.find((existingTag) => existingTag.id === tag.id)) {
      //   this.toolsInfoRepo.save(toolInfo);
      // } else throw new ConflictException(`Tag already added`);

      const faviconResponse = await fetch(
        `https://www.google.com/s2/favicons?sz=128&domain=${url}`,
      );
      const faviconPath = faviconResponse.ok
        ? faviconResponse.url
        : '/favicon.ico';

      const toolInfoData = {
        id: createdTool.id,
        tags: tagsArray,
        title,
        description,
        url,
        faviconPath,
      };
      const toolInfo = new ToolInfo({ ...toolInfoData, valid: true });
      const toolInfoDrawer = new ToolInfo({ ...toolInfoData, valid: false });

      await this.toolsInfoRepo.save([toolInfo, toolInfoDrawer]);

      return createdTool;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY')
        throw new ConflictException('Duplicated tool');
      // if (error.code === '')
      else throw error;
    }
  }

  async updateTool(id: number, data: UpdateToolInfo, user: User) {
    const update = await this.toolsInfoRepo.update(id, data);

    if (update.affected === 0) new NotFoundException();
    // Change tool status
    await this.toolsRepo.update(id, { state: ToolStateEnum.UPDATED });

    // Generate process data
    const processData = {
      // TODO change to constructor on entity
      tool: tool,
      prev_state: tool.state,
      state: ToolStateEnum.UPDATED,
      // message: data.message,
      processed_by: user,
      processed_time: new Date(), // TODO change to dayjs
    };
    const processed = await this.processToolRepo.save(processData);
    const newTool = await this.toolsInfoRepo.save(data);

    return newTool;
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

  //endregion TAG
  //#region PRIVATE

  // Check if the URL exists
  async checkUrl(url: string): Promise<boolean> {
    try {
      await fetch(url);
      return true;
    } catch (err) {
      return false;
    }
  }
  //endregion PRIVATE
}
