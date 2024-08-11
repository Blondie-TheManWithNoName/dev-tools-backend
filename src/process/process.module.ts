import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessTool } from 'src/entities/process_tool';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessTool])],
  providers: [ProcessService],
  controllers: [ProcessController],
})
export class ProcessModule {}
