import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CreateTool } from '../interfaces/create-tool';
import { Type } from 'class-transformer';

export class CreateToolDTO implements CreateTool {
  /** Title */
  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsString()
  title: string;
  /** URL */
  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsUrl()
  url: string;
  /** Description */
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  description: string;

  /** Tags */
  @ApiProperty({ required: false, type: String, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  tags: string[];
}
