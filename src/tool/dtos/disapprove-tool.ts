import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNumber } from 'class-validator';

export class DisapproveToolDTO {
  /** Tool Id */
  @ApiProperty({ required: true, type: Number })
  @IsDefined()
  @IsNumber()
  tool_id: number;
  /** Approved or not */
  @ApiProperty({ required: true, type: Boolean })
  @IsDefined()
  @IsBoolean()
  approved: boolean;
}
