import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Tool } from 'src/entities/tool';
import { ToolInfo } from 'src/entities/tool_info';
import { Kit } from 'src/entities/kit';
@Injectable()
export class KitService {
  constructor(
    @InjectRepository(Kit)
    private readonly kitRepo: Repository<Kit>,
    @InjectRepository(Tool) private toolsRepo: Repository<Tool>,
    @InjectRepository(ToolInfo)
    private readonly toolsInfoRepo: Repository<ToolInfo>,
  ) {}
}
