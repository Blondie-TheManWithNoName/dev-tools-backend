import { Tool } from 'src/entities/tool';

export interface AddToolData extends AddToolBody {}

export interface AddToolBody {
  //** Kit ID */
  kitId: number;
  //** Tools */
  toolId: number;
}
