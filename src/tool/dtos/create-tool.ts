import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
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
  @IsUrl()
  url: string;
  /** Description */
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  description: string;
  /** Approved or not */
  @ApiProperty({ required: true, type: Boolean })
  @IsDefined()
  @IsBoolean()
  approved: boolean;
}
