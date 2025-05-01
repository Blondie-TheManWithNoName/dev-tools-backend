export interface EditKitData extends EditKitBody, EditKitParams {}

export interface EditKitBody {
  //** Tool IDs */
  toolIds?: number[];
  //** Title */
  title?: string;
  //** Description */
  descritpion?: string;
}

export interface EditKitParams {
  //** Kit ID */
  kitId: number;
}
