import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class SignInDTO {
  @ApiProperty({ type: String, required: true })
  @IsDefined()
  @IsString()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsDefined()
  @IsString()
  password: string;
}
