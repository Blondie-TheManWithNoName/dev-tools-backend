import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from 'src/entities/tool';
import { ProcessTool } from 'src/entities/process_tool';
import { ToolInfo } from 'src/entities/tool_info';
import { Tag } from 'src/entities/tag';

@Module({
  imports: [TypeOrmModule.forFeature([Tool, ProcessTool, ToolInfo, Tag])],
  providers: [ToolService],
  controllers: [ToolController],
})
export class ToolModule {}
