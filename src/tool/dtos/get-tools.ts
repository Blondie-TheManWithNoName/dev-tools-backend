import { IsArray, IsOptional } from 'class-validator';

import { QueryFilters } from 'src/app.interfaces';
import { QueryFiltersDTO } from 'src/app.dtos';
import { Type } from 'class-transformer';

export class GetToolsQueryDTO implements ToolFilters {
  /** Filter by Tags */
  @IsOptional()
  @IsArray()
  @Type(() => String)
  tags: string[];

  @IsOptional()
  options: QueryFiltersDTO;
}

export interface ToolFilters {
  tags: string[];
}

export type FindOptions = QueryFilters;
