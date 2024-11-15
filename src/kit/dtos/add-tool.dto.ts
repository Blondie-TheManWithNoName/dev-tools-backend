import { Tool } from 'src/entities/tool';
import { IsArray, IsDefined, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AddToolBody } from '../interfaces/add-tool.interface';

export class AddToolBodyDTO implements AddToolBody {
  /** Kit ID */
  @IsDefined()
  @IsNumber()
  kitId: number;
  /** Tools */
  @IsDefined()
  @IsNumber()
  toolId: number;
}
