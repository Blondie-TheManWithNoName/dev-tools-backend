import { AuthRequest } from 'src/app.interfaces';

export interface GetKitData extends GetKitParams {}

export interface GetKitParams {
  //** Kit ID */
  kitId: number;
}
