import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTool } from './interfaces/create-tool';
import { InjectRepository } from '@nestjs/typeorm';
import { Tool } from 'src/entities/tool';
import { Repository } from 'typeorm';
import { UpdateToolInfo } from './interfaces/update-tool';
import { SetStateTool } from './interfaces/approve-tool';
import { ToolStateEnum } from 'src/enums/tool-state';
import { User } from 'src/entities/user';
import { ToolState } from 'src/entities/tool_state';
import { ProcessTool } from 'src/entities/process_tool';
import { ToolInfo } from 'src/entities/tool_info';

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
  ) {}
  async getAllTools() {
    const [tools, count] = await this.toolsRepo.findAndCount();

    return {
      httpStatus: HttpStatus.OK,
      count: count,
      tools: tools,
    };
  }
  async getTool(id: number) {
    const tool = await this.toolsRepo.findOneBy({ tool_id: id });
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
          state_id: ToolStateEnum.pending,
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

  async updateTool(data: UpdateTool) {
    const tool = await this.toolsRepo.save(data);
    if (tool) {
      return {
        httpStatus: HttpStatus.OK,
        message: 'Success!',
        tool: tool,
      };
    } else throw new NotFoundException();
  }

  async setStateTool(data: SetStateTool, user) {
    const oldTool = await this.toolsRepo.findOne({
      where: { tool_id: data.tool_id },
      relations: ['state', 'posted_by', 'favorites'],
    });
    console.log('oldTOol', oldTool);
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
}
