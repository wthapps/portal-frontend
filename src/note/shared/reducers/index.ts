import { ActionReducerMap, createSelector } from '@ngrx/store';

import * as fromNote from './note';
import * as fromFolder from './folder';
import * as fromMixedEntity from '../mixed-enity/mixed-entity.reducer';
/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  notes: fromNote.State;
  folders: fromFolder.State;
  mixedEntity: fromMixedEntity.State;
}

export const reducers: ActionReducerMap<State> = {
  notes: fromNote.reducer,
  folders: fromFolder.reducer,
  mixedEntity: fromMixedEntity.reducer
};

export const getNotesState = (state: State) => state.notes;

export const getNotesEntities = createSelector(
  getNotesState,
  fromNote.getNotes
);
export const getFolderEntities = createSelector(
  getNotesState,
  fromNote.getFolders
);
export const getSelectAll = createSelector(
  getNotesState,
  fromNote.getSelectAll
);
export const getSelectedObjects = createSelector(
  getNotesState,
  fromNote.getSelectedObjects
);
export const getCurrentNote = createSelector(
  getNotesState,
  fromNote.getCurrentNote
);
export const getLoading = createSelector(getNotesState, fromNote.getLoading);
export const getLoaded = createSelector(getNotesState, fromNote.getLoaded);

export const getNoteMixEntities = createSelector(
  getNotesEntities,
  getFolderEntities,
  (notes, folders) => ({ notes, folders })
);

export const getFoldersState = (state: State) => state.folders;
export const getFoldersTree = createSelector(
  getFoldersState,
  fromFolder.getFoldersTree
);
export const getCurrentFolderPath = createSelector(
  getFoldersState,
  fromFolder.getCurrentFolderPath
);
export const getCurrentFolder = createSelector(
  getFoldersState,
  fromFolder.getCurrentFolder
);
