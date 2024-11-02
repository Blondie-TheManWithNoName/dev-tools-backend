export interface UpdateToolInfo {
  /** Tool Id */
  tool_id: number;
  /** Title */
  title?: string;
  /** URL */
  url?: string;
  /** Not Approved */
  // stateStateId: ToolState;
  description: string;

  valid: boolean;
}
