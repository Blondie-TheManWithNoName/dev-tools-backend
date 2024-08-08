import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Tool } from 'src/entities/tool';
import { Favorite } from 'src/entities/favorites';
import { ToolInfo } from 'src/entities/tool_info';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tool, Favorite, ToolInfo])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
