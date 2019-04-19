import { createSelector } from '@ngrx/store';

import * as fromNote from './../note';
import * as context from './../context';
import { AppState } from '@notes/shared/reducers/state';
import { _wu } from '@wth/shared/shared/utils/utils';
import { Note } from '@shared/shared/models/note.model';
import { Folder } from '../folder';

export const getNotesState = (state: AppState) => state.notes;
export const getFoldersState = (state: AppState) => state.folders;

export const getNotesEntities = createSelector(
  getNotesState,
  fromNote.getNotes
);
export const getFolderEntities = createSelector(
  getNotesState,
  fromNote.getFolders
);

const FIELD_MAP = { owner: 'user.name' };

export const getNotes = createSelector(
  getNotesEntities,
  context.getSortOptionContext,
  (notes: { [id: number]: Note }, sort: any) => {
    let sortField = ['name', 'title'].includes(sort.field)
      ? 'name'
      : sort.field;
    sortField = FIELD_MAP[sort.field] || sortField;
    return Object.values(notes).sort((a: any, b: any) =>
      _wu.compareBy(a, b, sort.desc, sortField)
    );
  }
);

export const getFolders = createSelector(
  getFolderEntities,
  context.getSortOptionContext,
  (notes: { [id: number]: Folder }, sort: any) => {
    let sortField = ['name', 'title'].includes(sort.field)
      ? 'name'
      : sort.field;
    sortField = FIELD_MAP[sort.field] || sortField;
    return Object.values(notes).sort((a: any, b: any) =>
      _wu.compareBy(a, b, sort.desc, sortField)
    );
  }
);

export const getAllItems = createSelector(
  getNotesEntities,
  getFolderEntities,
  context.getSortOptionContext,
  (notes: any, folders: any, sort: any) => {
    const noteArr: any[] = Object.values(notes).sort((a: any, b: any) =>
      _wu.compareBy(a, b, sort.desc, 'created_at')
    );
    const folderArr: any[] = Object.values(folders).sort((a: any, b: any) =>
      _wu.compareBy(a, b, sort.desc, 'created_at')
    );
    return [...folderArr, ...noteArr];
  }
);
