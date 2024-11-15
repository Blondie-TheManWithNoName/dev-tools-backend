import { Tool } from 'src/entities/tool';
import { CreateKitBody } from '../interfaces/create-kit.interface';
import { IsArray, IsDefined, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateKitBodyDTO implements CreateKitBody {
  /** Title */
  @IsString()
  @IsDefined()
  title: string;
  /** Title */
  @IsString()
  @IsOptional()
  description?: string;
  //   /** Tools */
  //   @IsArray()
  //   @IsDefined()
  //   @Type(() => Tool)
  //   tools: Tool[];
}
