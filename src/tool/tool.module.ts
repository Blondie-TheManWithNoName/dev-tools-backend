import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from 'src/entities/tool';
import { ToolState } from 'src/entities/tool_state';
import { ProcessTool } from 'src/entities/process_tool';
import { ToolInfo } from 'src/entities/tool_info';

@Module({
  imports: [TypeOrmModule.forFeature([Tool, ToolState, ProcessTool, ToolInfo])],
  providers: [ToolService],
  controllers: [ToolController],
})
export class ToolModule {}
