import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsDefined, IsInt, IsOptional } from 'class-validator';

export class DeleteUserDTO {
  /** User Id */
  @ApiProperty({ required: true, type: Number })
  @IsDefined()
  @IsInt()
  user_id: number;
}
