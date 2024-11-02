import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsEnum, IsNumber } from 'class-validator';
import { ToolStateEnum } from 'src/enums/tool-state';

export class SetStateToolDTO {
  /** State */
  @ApiProperty({ required: true, type: Number })
  @IsDefined()
  @IsEnum(ToolStateEnum)
  state: keyof typeof ToolStateEnum;
}
