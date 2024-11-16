import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Tool } from 'src/entities/tool';
import { ToolInfo } from 'src/entities/tool_info';
import { In, Repository } from 'typeorm';
import { Kit } from 'src/entities/kit';
import { GetKitData } from './interfaces/get-kit.interface';
import { CreateKitData } from './interfaces/create-kit.interface';
import { GetKitsData } from './interfaces/get-kits.interface';
import { ToolStateEnum } from 'src/enums/tool-state';
import { AddToolData } from './interfaces/add-tool.interface';
import { RemoveToolData } from './interfaces/remove-tool.interface';

@Injectable()
export class KitService {
  constructor(
    @InjectRepository(Kit)
    private readonly kitRepo: Repository<Kit>,
    @InjectRepository(Tool) private toolsRepo: Repository<Tool>,
    @InjectRepository(ToolInfo)
    private readonly toolsInfoRepo: Repository<ToolInfo>,
  ) {}

  async getAllKits(data: GetKitsData, user: User) {
    const { page = 1, take = 10 } = data;

    const query = this.kitRepo
      .createQueryBuilder('kit')
      .leftJoinAndSelect('kit.tools', 'tools')
      .leftJoinAndSelect('tools.toolInfos', 'toolInfos')
      .where('tools.state = :state', { state: ToolStateEnum.APPROVED });

    //FILTERS
    Object.keys(data).forEach((key) => {
      switch (key) {
        // Pagination
        case 'page':
          const skip = (page - 1) * (take ? take : 0);
          if (skip) query.skip(skip);
          break;
        case 'take':
          query.take(Number(take));
          break;
      }
    });

    const [kits, count] = await query.getManyAndCount();

    return {
      httpStatus: HttpStatus.OK,
      count,
      kits,
    };
  }

  async getKit(data: GetKitData, user: User) {
    const { kitId } = data;

    const kit = await this.kitRepo.findOneBy({ id: kitId });
    if (!kit) throw new NotFoundException('Kit not found');

    return {
      httpStatus: HttpStatus.OK,
      kit,
    };
  }

  async createKit(data: CreateKitData, user: User) {
    // Cheeck Tools existance
    // await Promise.all(
    //   data.tools.map(async (tool) => {
    //     const foundTool = await this.toolsRepo.findOneBy({ id: tool.id });
    //     if (!foundTool) throw new NotFoundException('Tool not found');
    //   }),
    // );

    const kit = await this.kitRepo.save({ ...data, user });
    return {
      httpStatus: HttpStatus.OK,
      kit,
    };
  }

  async addTool(data: AddToolData, user: User) {
    const { kitId, toolId } = data;

    const kit = await this.kitRepo.findOneBy({ id: kitId });
    if (!kit) throw new NotFoundException('Kit not found');
    // Guard Check Own Kit
    if (kit.owner !== user)
      throw new ForbiddenException('User does not own this kit');

    const tool = await this.toolsRepo.findOneBy({ id: toolId });
    if (!tool) throw new NotFoundException('Tool not found');

    kit.tools.push(tool);
    await this.kitRepo.save(kit);

    return {
      httpStatus: HttpStatus.OK,
      kit,
  async removeTool(data: RemoveToolData, user: User) {
    const { kitIds, toolId } = data;

    const kits = await this.kitRepo.find({
      where: { id: In(kitIds) },
      relations: ['tools', 'owner'],
    });

    if (kits.length !== kitIds.length)
      throw new NotFoundException('Kit not found');
    // Guard Check Own Kit
    kits.forEach((kit) => {
      if (kit.owner.user_id !== user.user_id)
        throw new ForbiddenException('User does not own this kit');
    });

    const unafectedKits: number[] = [];
    await Promise.all(
      kits.map(async (kit) => {
        const toolIndex = kit.tools.findIndex((tool) => tool.id === toolId);

        if (toolIndex === -1) unafectedKits.push(kit.id);

        kit.tools.splice(toolIndex, 1);
        await this.kitRepo.save(kit);
      }),
    );

    if (unafectedKits.length === kits.length)
      throw new NotFoundException('Tool not found in any specified kits');

    return {
      httpStatus: HttpStatus.OK,
      message: 'Removed!',
      unafectedKits,
    };
  }
}
