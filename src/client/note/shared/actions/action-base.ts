import { Action } from '@ngrx/store';


export class ActionBase implements Action {
  type: string;
  payload?: any;
  // constructor(public payload: any) {}
}
