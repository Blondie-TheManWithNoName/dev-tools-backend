import { IsArray, IsDefined, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { RemoveToolBody } from '../interfaces/remove-tool.interface';

export class RemoveToolBodyDTO implements RemoveToolBody {
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
