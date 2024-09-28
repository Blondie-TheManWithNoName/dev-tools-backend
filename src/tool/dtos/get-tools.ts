import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ToBoolean } from 'src/app.decorators';
import { Tag } from 'src/entities/tag';

export class ToolFiltersDTO implements ToolFilters {
  /** Tag */
  @IsOptional()
  tags: Tag[];

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

export interface ToolFilters {
  tags: Tag[];
  search: string;
  take: number;
  page: number;
  orderDir: boolean;
}
