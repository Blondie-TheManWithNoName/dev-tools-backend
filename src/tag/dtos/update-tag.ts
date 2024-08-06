import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsString } from 'class-validator';

export class UpdateTagDTO {
  /** Tag name */
  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsString()
  name: string;
}
