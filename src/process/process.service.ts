import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessTool } from 'src/entities/process_tool';

@Injectable()
export class ProcessService {
  constructor(
    @InjectRepository(ProcessTool)
    private readonly processToolRepo: Repository<ProcessTool>,
  ) {}
  async getProcesses() {
    const process = await this.processToolRepo.find({
      relations: ['tool', 'prev_state', 'state', 'processed_by'],
    });
    return {
      httpStatus: HttpStatus.OK,
      tools: process,
    };
  }
}
