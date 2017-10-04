import { Action } from '@ngrx/store';
import { Note } from '../../../core/shared/models/note.model';
export const UPDATE = '[Note] Update';
export const NOTES_UPDATED = '[Notes] Updated';
export const ADD = '[Note] Add';
export const NOTES_ADDED = '[Notes] Added';
export const DELETE = '[Note] Delete';
export const MULTI_DELETE = '[Note] Multi-Delete';
export const NOTES_DELETED = '[Notes] Deleted';
export const SELECT = '[Note] Select';
export const SELECT_ALL = '[Note] Deselect All';
export const CHANGE_SORT_ORDER = '[Note] Change Sort Order';
export const LOAD = '[Note] Load';
export const LOAD_SUCCESS = '[Note] Load Success';
export const LOAD_FAIL = '[Note] Load Failed';
export const INIT_LOAD = '[Note] Init Load';
export const INIT_LOAD_DONE = '[Note] Init Load Done';
export const CHANGE_VIEW_MODE = '[Note] Change View Mode';

// Actions

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public payload: Note) {
  }
}

export class NotesUpdated implements Action {
  readonly  type = NOTES_UPDATED;

  constructor(public payload: Note[]) {
  }
}

export class Add implements Action {
  readonly type = ADD;

  constructor(public payload: Note) {
  }
}

export class NotesAdded implements Action {
  readonly type = NOTES_ADDED;

  constructor(public payload: Note[]) {
  }
}

export class Load implements Action {
  readonly type = LOAD;

  // parent_id: Selected folder id
  constructor(public payload: {parent_id: number | null}) {
  }
}

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: Note[]) {
  }
}

export class LoadFail implements Action {
  readonly type = LOAD_FAIL;

  constructor(public payload: Note[]) {
  }
}

export class Delete implements Action {
  readonly type = DELETE;

  constructor(public payload: {id: number, object_type: string}[]) {
  }
}

export class MultiDelete implements Action {
  readonly type = MULTI_DELETE;

  constructor() {
  }
}

export class NotesDeleted implements Action {
  readonly type = NOTES_DELETED;

  constructor(public payload: {id: number, object_type: string}[]) {
  }
}

export class Select implements Action {
  readonly type = SELECT;

  constructor(public payload: {id: number, object_type: string}) {
  }
}

export class SelectAll implements Action {
  readonly type = SELECT_ALL;
}

export class ChangeSortOrder implements Action {
  readonly type = CHANGE_SORT_ORDER;
}

export class InitLoad implements Action {
  readonly type = INIT_LOAD;
}

export class InitLoadDone implements Action {
  readonly type = INIT_LOAD_DONE;
}

export class ChangeViewMode implements Action {
  readonly type = CHANGE_VIEW_MODE;

  constructor(public payload: string) {

  }
}

// TODO: Add RouterState | Activated Route
export type NoteActions = Add | Update | NotesUpdated | NotesAdded | Delete | MultiDelete | NotesDeleted | Load | LoadSuccess | LoadFail | ChangeSortOrder | Select | SelectAll | InitLoad | InitLoadDone | ChangeViewMode;

