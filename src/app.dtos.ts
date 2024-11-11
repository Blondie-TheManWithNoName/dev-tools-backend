import {
  IsInt,
  IsPositive,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ToBoolean } from 'src/app.decorators';
import { QueryFilters } from './app.interfaces';

export class QueryFiltersDTO implements QueryFilters {
  /** Number of page */
  @IsInt()
  @IsPositive()
  @IsOptional()
  page: number;
  /** Number of elements per page */
  @IsInt()
  @IsPositive()
  @IsOptional()
  take: number;
  /** Search */
  @IsString()
  @IsOptional()
  search: string;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  orderDir: boolean;
}
