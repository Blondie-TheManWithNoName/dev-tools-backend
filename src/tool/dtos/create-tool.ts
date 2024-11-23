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
import { Transform, Type } from 'class-transformer';

export class CreateToolDTO implements CreateTool {
  /** Title */
  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsString()
  title: string;
  /** URL */
  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @Transform(({ value }) => {
    if (!value.startsWith('https://')) {
      value = value.split('http://')[1] ?? value;
      value = 'https://' + value;
    }
    return value;
  })
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
  tags: string[] = [];
}
