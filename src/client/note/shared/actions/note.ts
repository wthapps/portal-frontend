

import { Note } from '../reducers/note';
import { Action } from '@ngrx/store';
export const UPDATE = '[Note] Update';
export const NOTES_UPDATED = '[Notes] Updated';
export const NOTE_UPDATED = '[Note] Updated';
export const ADD = '[Note] Add';
export const NOTES_ADDED = '[Notes] Added';
export const DELETE = '[Note] Delete';
export const MULTI_DELETE = '[Note] Multi-Delete';
export const NOTES_DELETED = '[Notes] Deleted';
export const LOAD_SUCCESS = '[Note] Load Success';
export const SELECT = '[Note] Select';
export const DESELECT = '[Note] Deselect';
export const DESELECT_ALL = '[Note] Deselect All';
export const CHANGE_SORT_ORDER = '[Note] Change Sort Order';

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

export class NoteUpdated implements Action {
  readonly  type = NOTE_UPDATED;

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

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: Note[]) {
  }
}

export class Delete implements Action {
  readonly type = DELETE;

  constructor(public payload: number[]) {
  }
}

export class MultiDelete implements Action {
  readonly type = MULTI_DELETE;

  constructor() {
  }
}

export class NotesDeleted implements Action {
  readonly type = NOTES_DELETED;

  constructor(public payload: Note[]) {
  }
}

export class Select implements Action {
  readonly type = SELECT;

  constructor(public payload: number) {
  }
}

export class DeselectAll implements Action {
  readonly type = DESELECT_ALL;
}

export class ChangeSortOrder implements Action {
  readonly type = CHANGE_SORT_ORDER;

}

// TODO: Add RouterState | Activated Route
export type NoteActions = Add | Update | NotesUpdated | NoteUpdated | NotesAdded | Delete | MultiDelete | NotesDeleted |  LoadSuccess | ChangeSortOrder | Select | DeselectAll;
