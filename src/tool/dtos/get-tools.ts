import { Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { QueryFiltersDTO } from 'src/app.dtos';
import { QueryFilters } from 'src/app.interfaces';

export class GetToolsQueryDTO extends QueryFiltersDTO implements ToolFilters {
  /** Tag */
  @IsOptional()
  @IsArray()
  @Type(() => String)
  tags: string[];
}

export interface ToolFilters extends QueryFilters {
  tags: string[];
}
