import { Action } from '@ngrx/store';
export const EDIT = '[Modal] Edit';
export const UPDATE = '[Note] Update';

// Actions

export class Edit implements Action {
  readonly type = EDIT;

}

// TODO: Add RouterState | Activated Route
export type ModalActions = Edit;

