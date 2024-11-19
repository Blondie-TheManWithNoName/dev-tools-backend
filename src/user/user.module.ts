import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Tool } from 'src/entities/tool';
import { ToolInfo } from 'src/entities/tool_info';
import { Kit } from 'src/entities/kit';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tool, ToolInfo, Kit])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
