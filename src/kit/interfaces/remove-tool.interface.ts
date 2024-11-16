import { Tool } from 'src/entities/tool';

export interface RemoveToolData extends RemoveToolBody {}

export interface RemoveToolBody {
  //** Kit ID */
  kitIds: number[];
  //** Tools */
  toolId: number;
}
