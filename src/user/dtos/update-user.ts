import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDTO {
  /** User Id */
  @ApiProperty({ required: true, type: Number })
  @IsDefined()
  @IsInt()
  user_id: number;
  /** Username */
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  username: string;
  /** Email */
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsEmail()
  email: string;
  /** Password */
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  password: string;
}
