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
import { ToolDTO } from 'src/tool/dtos/tool.dto';
import { KitPreviewDTO } from './dtos/kit-preview.dto';

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
      .leftJoinAndSelect('kit.owner', 'owner')
      .leftJoinAndSelect('tools.toolInfos', 'toolInfos');

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

    const procKits = kits.map((kit) => new KitPreviewDTO(kit));

    return {
      httpStatus: HttpStatus.OK,
      count,
      kits: procKits,
    };
  }

  async getKit(data: GetKitData, user: User) {
    const { kitId } = data;
    const kit = await this.kitRepo
      .createQueryBuilder('kit')
      .leftJoinAndSelect('kit.tools', 'tools')
      .leftJoinAndSelect('tools.toolInfos', 'toolInfos')
      .where('kit.id = :kitId', { kitId })
      .andWhere('toolInfos.valid = true')
      .getOne();

    console.log('kit', kit);
    if (!kit) throw new NotFoundException('Kit not found');

    const procKit = kit.tools.map((tool) => new ToolDTO(tool));

    return {
      httpStatus: HttpStatus.OK,
      kit: procKit,
    };
  }

  async createKit(data: CreateKitData, user: User) {
    const kit = await this.kitRepo.save({ ...data, owner: user });
    return {
      httpStatus: HttpStatus.OK,
      kit,
    };
  }

  async addTool(data: AddToolData, user: User) {
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

    const tool = await this.toolsRepo.findOneBy({ id: toolId });
    if (!tool) throw new NotFoundException('Tool not found');

    if (
      tool.state === ToolStateEnum.PENDING ||
      tool.state === ToolStateEnum.REJECTED
    )
      throw new BadRequestException('Tool state not valid');

    // const isDuplicate = kit.tools.some(
    //   (existingTool) => existingTool.id === tool.id,
    // );
    // if (isDuplicate) throw new BadRequestException('Tool already on Kit');

    await Promise.all(
      kits.map(async (kit) => {
        kit.tools.push(tool);
        await this.kitRepo.save(kit);
      }),
    );

    return {
      httpStatus: HttpStatus.OK,
      message: 'Added!',
      //   kits,
    };
  }

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
