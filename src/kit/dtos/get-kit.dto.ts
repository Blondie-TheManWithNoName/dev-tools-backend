import { IsDefined, IsInt, IsPositive } from 'class-validator';

export class GetKitParamsDTO {
  /** Kit ID */
  @IsInt()
  @IsPositive()
  @IsDefined()
  kitId: number;
}
