import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { GetKitsQuery } from '../interfaces/get-kits';

export class GetUserKitDTO implements GetKitsQuery {
  /** Tool Id */
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  toolId?: number;
  /** View */
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  view?: 'full' | 'preview' | 'modal';
}
