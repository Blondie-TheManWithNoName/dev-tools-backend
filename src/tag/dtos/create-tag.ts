import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { CreateTag } from '../interfaces/create-tag';

export class CreateTagDTO implements CreateTag {
  /** Tag name */
  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsString()
  name: string;
}
