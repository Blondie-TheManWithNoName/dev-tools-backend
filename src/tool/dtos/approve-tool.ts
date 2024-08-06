import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNumber } from 'class-validator';

export class ApproveToolDTO {
  /** Approved or not */
  @ApiProperty({ required: true, type: Boolean })
  @IsDefined()
  @IsBoolean()
  approved: boolean;
}
