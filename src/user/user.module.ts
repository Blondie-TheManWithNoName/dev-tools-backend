import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Tool } from 'src/entities/tool';
import { Favorite } from 'src/entities/favorites';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tool, Favorite])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
