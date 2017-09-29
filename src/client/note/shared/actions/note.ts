

import { Note } from '../models/note';
import { Action } from '@ngrx/store';
export const NOTES_UPDATED = 'NOTES_UPDATED';
export const NOTE_UPDATED = 'NOTE_UPDATED';
export const ADD = 'NOTE_ADD';
export const NOTES_ADDED = 'NOTES_ADDED';
export const NOTES_REMOVED = 'NOTES_REMOVED';
export const LOAD_SUCCESS = 'LOAD_SUCCESS';
export const SELECT = 'SELECT';
export const DESELECT = 'DESELECT';
export const DESELECT_ALL = 'DESELECT_ALL';
export const CHANGE_SORT_ORDER = 'CHANGE_SORT_ORDER';

// Actions
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

export class NotesRemoved implements Action {
  readonly type = NOTES_REMOVED;

  constructor(public payload: number[]) {
  }
}

export class Select implements Action {
  readonly type = SELECT;

  constructor(public payload: number) {
  }
}

export class Deselect implements Action {
  readonly type = DESELECT;

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
export type NoteActions = Add | NotesUpdated | NoteUpdated | NotesAdded | NotesRemoved |  LoadSuccess | ChangeSortOrder | Select | Deselect | DeselectAll;
