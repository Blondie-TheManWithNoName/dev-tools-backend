import { IsArray, IsDefined, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AddToolBody } from '../interfaces/add-tool.interface';

export class AddToolBodyDTO implements AddToolBody {
  /** Kit ID */
  @IsDefined()
  @IsArray()
  @Type(() => Number)
  kitIds: number[];
  /** Tools */
  @IsDefined()
  @IsNumber()
  toolId: number;
}
