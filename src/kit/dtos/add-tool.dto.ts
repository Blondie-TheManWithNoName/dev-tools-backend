import {
  IsArray,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EditKitBody } from '../interfaces/add-tool.interface';

export class EditKitBodyDTO implements EditKitBody {
  /** Tool IDs */
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  toolIds?: number[];
  /** Title */
  @IsOptional()
  @IsString()
  title?: string;
  /** Description */
  @IsOptional()
  @IsString()
  descritpion?: string;
}

export class EditKitParamsDTO {
  /** Kit ID */
  @IsDefined()
  @IsNumber()
  kitId: number;
}
