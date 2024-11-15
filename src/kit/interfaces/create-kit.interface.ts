import { Tool } from 'src/entities/tool';

export interface CreateKitData extends CreateKitBody {}

export interface CreateKitBody {
  //** Title */
  title: string;
  //** Description */
  description?: string;
  // //** Tools */
  // tools: Tool[];
}
