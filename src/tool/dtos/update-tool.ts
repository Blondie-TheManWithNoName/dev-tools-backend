import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateToolDTO {
  /** Title */
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  title: string;
  /** URL */
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsUrl()
  url: string;
  /** Description */
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  description: string;
}
