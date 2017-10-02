import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer,
} from '@ngrx/store';

import * as fromNote from './note';
import * as fromFolder from './folder';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  notes: fromNote.State;
  // folders: fromFolder.State;
  // router: fromRouter.RouterReducerState;
}

export const reducers: ActionReducerMap<State> = {
  notes: fromNote.reducer,
  // folder: fromFolder.reducer,
  // routerReducer: fromRouter.routerReducer
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return  reducer(state, action);
  };
}

export const getNotesState = (state: State) => state.notes;

export const getNotesEntities = createSelector(getNotesState, fromNote.getNotes);
export const getOrderDesc = createSelector(getNotesState, fromNote.getOrderDesc);
export const getSortedNotes = createSelector(getNotesState, fromNote.getSortedNotes);
