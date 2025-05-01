import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { CreateTool } from '../interfaces/create-tool';

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
  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsString()
  @Length(5, 55)
  description: string;

  /** Tags */
  @ApiProperty({ required: false, type: String, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  tags: string[] = [];
}
