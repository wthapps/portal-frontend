//
//
// // import { Folder } from '../models/folder';
// import { Action } from '@ngrx/store';
// export const UPDATE = 'UPDATE';
// export const NOTES_UPDATED = 'NOTES_UPDATED';
// export const NOTE_UPDATED = 'NOTE_UPDATED';
// export const ADD = 'NOTE_ADD';
// export const NOTES_ADDED = 'NOTES_ADDED';
// export const DELETE = 'DELETE';
// export const MULTI_DELETE = 'MULTI_DELETE';
// export const NOTES_DELETED = 'NOTES_DELETED';
// export const LOAD_SUCCESS = 'LOAD_SUCCESS';
// export const SELECT = 'SELECT';
// export const DESELECT = 'DESELECT';
// export const DESELECT_ALL = 'DESELECT_ALL';
// export const CHANGE_SORT_ORDER = 'CHANGE_SORT_ORDER';
//
// // Actions
//
// export class Update implements Action {
//   readonly type = UPDATE;
//
//   constructor(public payload: Note) {
//   }
// }
//
// export class NotesUpdated implements Action {
//   readonly  type = NOTES_UPDATED;
//
//   constructor(public payload: Note[]) {
//   }
// }
//
// export class NoteUpdated implements Action {
//   readonly  type = NOTE_UPDATED;
//
//   constructor(public payload: Note[]) {
//   }
// }
//
//
// export class Add implements Action {
//   readonly type = ADD;
//
//   constructor(public payload: Note) {
//   }
// }
//
// export class NotesAdded implements Action {
//   readonly type = NOTES_ADDED;
//
//   constructor(public payload: Note[]) {
//   }
// }
//
// export class LoadSuccess implements Action {
//   readonly type = LOAD_SUCCESS;
//
//   constructor(public payload: Note[]) {
//   }
// }
//
// export class Delete implements Action {
//   readonly type = DELETE;
//
//   constructor(public payload: number[]) {
//   }
// }
//
// export class MultiDelete implements Action {
//   readonly type = MULTI_DELETE;
//
//   constructor() {
//   }
// }
//
// export class NotesDeleted implements Action {
//   readonly type = NOTES_DELETED;
//
//   constructor(public payload: Note[]) {
//   }
// }
//
// export class Select implements Action {
//   readonly type = SELECT;
//
//   constructor(public payload: number) {
//   }
// }
//
// export class Deselect implements Action {
//   readonly type = DESELECT;
//
//   constructor(public payload: number) {
//   }
// }
//
// export class DeselectAll implements Action {
//   readonly type = DESELECT_ALL;
// }
//
// export class ChangeSortOrder implements Action {
//   readonly type = CHANGE_SORT_ORDER;
//
// }
//
// // TODO: Add RouterState | Activated Route
// export type NoteActions = Add | Update | NotesUpdated | NoteUpdated | NotesAdded | Delete | MultiDelete | NotesDeleted |  LoadSuccess | ChangeSortOrder | Select | Deselect | DeselectAll;
