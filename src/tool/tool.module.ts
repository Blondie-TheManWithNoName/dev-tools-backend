import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from 'src/entities/tool';

@Module({
  imports: [TypeOrmModule.forFeature([Tool])],
  providers: [ToolService],
  controllers: [ToolController],
})
export class ToolModule {}
