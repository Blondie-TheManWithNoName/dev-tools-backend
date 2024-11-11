import { Module } from '@nestjs/common';
import { KitController } from './kit.controller';
import { KitService } from './kit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from 'src/entities/tool';
import { ToolInfo } from 'src/entities/tool_info';
import { Kit } from 'src/entities/kit';

@Module({
  imports: [TypeOrmModule.forFeature([Kit, Tool, ToolInfo])],
  controllers: [KitController],
  providers: [KitService],
})
export class KitModule {}
