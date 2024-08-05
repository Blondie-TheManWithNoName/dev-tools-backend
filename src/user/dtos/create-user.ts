import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';
import { CreateUser } from '../interfaces/create-user';

export class CreateUserDTO implements CreateUser {
  /** Username */
  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsString()
  username: string;
  /** Email */
  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsEmail()
  email: string;
  /** Password */
  @ApiProperty({ required: true, type: String })
  @IsDefined()
  @IsString()
  password: string;
}
