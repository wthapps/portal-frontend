import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer,
} from '@ngrx/store';

import * as fromNote from './note';
import * as fromFolder from './folder';
import * as context from './context';
import * as fromMixedEntity from '../mixed-enity/mixed-entity.reducer';
/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  notes: fromNote.State;
  folders: fromFolder.State;
  mixedEntity: fromMixedEntity.State;
  // router: fromRouter.RouterReducerState;
}

export const reducers: ActionReducerMap<State> = {
  notes: fromNote.reducer,
  folders: fromFolder.reducer,
  mixedEntity: fromMixedEntity.reducer
  // routerReducer: fromRouter.routerReducer
};

// // console.log all actions
// export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
//   return function(state: State, action: any): State {
//     console.log('state', state);
//     console.log('action', action);
//
//     return  reducer(state, action);
//   };
// }

export const getNotesState = (state: State) => state.notes;

export const getNotesEntities = createSelector(getNotesState, fromNote.getNotes);
export const getOrderDesc = createSelector(getNotesState, fromNote.getOrderDesc);
export const getSortOption = createSelector(getNotesState, fromNote.getSortOption);
// export const getSortedNotes = createSelector(getNotesState, fromNote.getSortedNotes);
export const getFolderEntities = createSelector(getNotesState, fromNote.getFolders);
// export const getSortedFolders = createSelector(getNotesState, fromNote.getSortedFolders);
export const getSelectAll = createSelector(getNotesState, fromNote.getSelectAll);
export const getSelectedObjects = createSelector(getNotesState, fromNote.getSelectedObjects);
export const getCurrentNote = createSelector(getNotesState, fromNote.getCurrentNote);
export const getViewMode = createSelector(getNotesState, fromNote.getViewMode);
export const getFirstSelectedObject = createSelector(getNotesState, fromNote.getFirstSelectedObject);
export const getLoading = createSelector(getNotesState, fromNote.getLoading);
export const getLoaded = createSelector(getNotesState, fromNote.getLoaded);

export const getFoldersState = (state: State) => state.folders;
export const getFoldersTree = createSelector(getFoldersState, fromFolder.getFoldersTree);
export const getCurrentFolderPath = createSelector(getFoldersState, fromFolder.getCurrentFolderPath);
export const getCurrentFolder = createSelector(getFoldersState, fromFolder.getCurrentFolder);
