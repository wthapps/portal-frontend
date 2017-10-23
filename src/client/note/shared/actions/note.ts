import { Action } from '@ngrx/store';
import { Note } from '../../../core/shared/models/note.model';
export const EDIT = '[Note] Edit';
export const UPDATE = '[Note] Update';
export const NOTE_UPDATED = '[Note] Updated';
export const MULTI_NOTES_UPDATED = '[Notes] Updated';
export const ADD = '[Note] Add';
export const NOTE_ADDED = '[Note] Added';
export const MULTI_NOTES_ADDED = '[Notes] Multi Added';
export const DELETE = '[Note] Delete';
export const MULTI_DELETE = '[Note] Multi-Delete';
export const NOTES_DELETED = '[Notes] Deleted';
export const SELECT = '[Note] Select';
export const SELECT_ONE = '[Note] Select One';
export const SELECT_ALL = '[Note] Select All';
export const DESELECT_ALL = '[Note] Deselect All';
export const CHANGE_SORT_ORDER = '[Note] Change Sort Order';
export const LOAD = '[Note] Load';
export const LOAD_SUCCESS = '[Note] Load Success';
export const LOAD_FAIL = '[Note] Load Failed';
export const INIT_LOAD = '[Note] Init Load';
export const INIT_LOAD_DONE = '[Note] Init Load Done';
export const TRASH_LOAD = '[Note] Trash Load';
export const CHANGE_VIEW_MODE = '[Note] Change View Mode';
export const UNDO = '[Note] Undo';
export const REDO = '[Note] Redo';
export const SET_FOLDERS = '[Note] Set Folders';
export const RESET_CURRENT_NOTE = '[Note] Reset Current Note';
export const MOVE_TO_FOLDER = '[MixedEntity] MOVE_TO_FOLDER';
export const MAKE_A_COPY    = '[MixedEntity] MAKE_A_COPY';
export const RESTORE    = '[Trash] Restore';
export const PERMANENT_DELETE    = '[Trash] Permanent Delete';
export const EMPTY_ALL    = '[Trash] Empty All';
export const ALL_DELETED    = '[Trash] All Deleted';

// Actions

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public payload: Note) {
  }
}

export class Edit implements Action {
  readonly type = EDIT;

  constructor(public payload: Note) {
  }
}

export class NoteUpdated implements Action {
  readonly  type = NOTE_UPDATED;

  constructor(public payload: Note) {
  }
}

export class MultiNotesUpdated implements Action {
  readonly  type = MULTI_NOTES_UPDATED;

  constructor(public payload: Note[]) {
  }
}

export class Add implements Action {
  readonly type = ADD;

  constructor(public payload: Note) {
  }
}
export class NoteAdded implements Action {
  readonly type = NOTE_ADDED;

  constructor(public payload: Note) {
  }
}

export class ResetCurrentNote implements Action {
  readonly type = RESET_CURRENT_NOTE;
}

export class MultiNotesAdded implements Action {
  readonly type = MULTI_NOTES_ADDED;

  constructor(public payload: Note[]) {
  }
}

export class Load implements Action {
  readonly type = LOAD;

  // parent_id: Selected folder id
  constructor(public payload: any) {
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

  constructor(public payload: {id: number, object_type: string, parent_id: number}) {
  }
}

export class SelectOne implements Action {
  readonly type = SELECT_ONE;

  constructor(public payload: {id: number, object_type: string, parent_id: number}) {
  }
}

export class DeSelectAll implements Action {
  readonly type = DESELECT_ALL;
}

export class SelectAll implements Action {
  readonly type = SELECT_ALL;
}

export class ChangeSortOrder implements Action {
  readonly type = CHANGE_SORT_ORDER;

  constructor(public payload: string) {

  }
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

export class Undo implements Action {
  readonly type = UNDO;
}

export class Redo implements Action {
  readonly type = REDO;
}

export class MoveToFolder implements Action {
  readonly type = MOVE_TO_FOLDER;

  constructor(public payload: {}) {
  }
}

export class MakeACopy implements Action {
  readonly type = MAKE_A_COPY;

  constructor(public payload: {}) {
  }
}

export type NoteActions = any;

