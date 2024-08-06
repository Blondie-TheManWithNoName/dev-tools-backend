import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsInt, IsString } from 'class-validator';

export class AddFavoriteDTO {
  /** Tool */
  @ApiProperty({ required: true, type: Number })
  @IsDefined()
  @IsInt()
  toolId: number;
}
