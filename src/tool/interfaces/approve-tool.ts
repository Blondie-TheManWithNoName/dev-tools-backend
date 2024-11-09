import { ToolStateEnum } from 'src/enums/tool-state';

export interface SetStateTool {
  /** Tool Id */
  id: number;
  /** Approved or not */
  state: keyof typeof ToolStateEnum;
}
