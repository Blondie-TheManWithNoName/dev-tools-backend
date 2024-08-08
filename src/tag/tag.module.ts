import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from 'src/entities/tool';
import { Tag } from 'src/entities/tag';
import { ToolInfo } from 'src/entities/tool_info';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, ToolInfo])],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
