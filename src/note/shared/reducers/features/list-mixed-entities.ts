import {
  createSelector
} from '@ngrx/store';

import * as fromNote from './../note';
import * as fromFolder from './../folder';
import * as context from './../context';
import { noteConstants, NoteConstants } from "note/shared/config/constants";
import { AppState } from "note/shared/reducers/state";

export const getNotesState = (state: AppState) => state.notes;
export const getFoldersState = (state: AppState) => state.folders;

export const getNotesEntities = createSelector(getNotesState, fromNote.getNotes);
export const getFolderEntities = createSelector(getNotesState, fromNote.getFolders);

export const getNotes = createSelector(getNotesEntities, context.getSortOptionContext,
  (notes: any, sort: any) => {
  let cloneNotes: any[] = [];
  Object.keys(notes).forEach((idx: any) => cloneNotes.push(notes[idx]));
  let sortField = ['name', 'title'].includes(sort.field) ? 'title' : sort.field;
  return cloneNotes.sort((a: any, b: any) => compareBy(a, b, sort.desc, sortField));
});

export const getFolders = createSelector(getFolderEntities, context.getSortOptionContext,
  (notes: any, sort: any) => {
  let cloneNotes: any[] = [];
  Object.keys(notes).forEach((idx: any) => cloneNotes.push(notes[idx]));
  let sortField = ['name', 'title'].includes(sort.field) ? 'name' : sort.field;
  return cloneNotes.sort((a: any, b: any) => compareBy(a, b, sort.desc, sortField));
});


function compareBy(objA: any, objB: any, orderDesc: boolean, field: string = 'title'): number {
  if (!objA || !objB) return;
  let o = orderDesc ? 1 : -1;
  if(objA[field] > objB[field])
    return 1*o;
  if(objA[field] < objB[field])
    return -1*o;

  return 0;
}
