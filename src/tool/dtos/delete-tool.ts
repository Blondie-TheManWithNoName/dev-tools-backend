import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt } from 'class-validator';

export class DeleteToolDTO {
  /** Tool Id */
  @ApiProperty({ required: true, type: Number })
  @IsDefined()
  @IsInt()
  id: number;
}
