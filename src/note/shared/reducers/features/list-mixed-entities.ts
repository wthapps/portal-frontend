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

const FIELD_MAP = {'owner': 'user.name'};

export const getNotes = createSelector(getNotesEntities, context.getSortOptionContext,
  (notes: any, sort: any) => {
  let cloneNotes: any[] = Object.keys(notes).map(o => notes[o]);
  // Object.keys(notes).forEach((idx: any) => cloneNotes.push(notes[idx]));
  let sortField = ['name', 'title'].includes(sort.field) ? 'title' : sort.field;
  sortField = FIELD_MAP[sort.field] || sortField;
  return cloneNotes.sort((a: any, b: any) => compareBy(a, b, sort.desc, sortField));
});

export const getFolders = createSelector(getFolderEntities, context.getSortOptionContext,
  (notes: any, sort: any) => {
  let cloneNotes: any[] = Object.keys(notes).map(o => notes[o]);
  // Object.keys(notes).forEach((idx: any) => cloneNotes.push(notes[idx]));
  let sortField = ['name', 'title'].includes(sort.field) ? 'name' : sort.field;
  sortField = FIELD_MAP[sort.field] || sortField;
  return cloneNotes.sort((a: any, b: any) => compareBy(a, b, sort.desc, sortField));
});

export const getAllItems = createSelector(getNotesEntities, getFolderEntities, context.getSortOptionContext, (notes: any, folders: any, sort: any) => {
  let noteArr: any[] = Object.keys(notes).map(o => notes[o]);
  let folderArr: any[] = Object.keys(folders).map(o => folders[o]);
  let allItems: any[] = [...folderArr, ...noteArr];
  return allItems.sort((a: any, b: any) => compareBy(a, b, sort.desc, 'created_at'));
});


function compareBy(objA: any, objB: any, orderDesc: boolean, field: string = 'title'): number {
  if (!objA || !objB) return;
  let o = orderDesc ? 1 : -1;

  if(_.get(objA, field) > _.get(objB, field))
    return 1*o;
  if(_.get(objA, field) < _.get(objB, field))
    return -1*o;

  return 0;
}
