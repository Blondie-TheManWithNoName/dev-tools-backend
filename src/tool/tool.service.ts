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
import { UpdateTool } from './interfaces/update-tool';
import { ApproveTool } from './interfaces/approve-tool';

@Injectable()
export class ToolService {
  constructor(
    @InjectRepository(Tool) private readonly toolsRepo: Repository<Tool>,
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
  async createTool(data: CreateTool) {
    try {
      const tool = await this.toolsRepo.save(data);
      return {
        httpStatus: HttpStatus.OK,
        message: 'Success!',
        tool: tool,
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

  async approveTool(data: ApproveTool) {
    const tool = await this.toolsRepo.save(data);
    if (tool) {
      return {
        httpStatus: HttpStatus.OK,
        message: 'Success!',
        tool: tool,
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
