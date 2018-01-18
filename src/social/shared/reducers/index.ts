
import { createSelector } from '@ngrx/store';
export const SHORTCUT_LOAD = '[SOCIAL] SHORT LOAD';
export const SHORTCUT_LOAD_DONE = '[SOCIAL] SHORT LOAD DONE';
export const SHORTCUT_UPDATE = '[SOCIAL] UPDATE SHORTCUT';
export const SHORTCUT_UPDATE_DONE = '[SOCIAL] UPDATE SHORTCUT DONE';
export const SHORTCUT_REMOVE = '[SOCIAL] REMOVE SHORTCUT';
export const SHORTCUT_REMOVE_DONE = '[SOCIAL] REMOVE SHORTCUT';


export interface AppState {
  shortcuts: {[id: number]: any};
  selectedIds: number[];
};
//
// export const socialInitialState: State = {
//   shortcuts: {},
//   selectedIds: []
// }

// export type AppState = { shortcuts: {[id: number]: any}, selectedIds: number[] };
export type State = {app: AppState };

export const socialInitialState: AppState = {
  shortcuts: {},
  selectedIds: []
}

export function appReducer(state = socialInitialState, action: any): AppState {
  switch (action.type) {
    case SHORTCUT_LOAD_DONE: {
      // return {...state, shortcuts: action.payload};
      return Object.assign({}, state, { shortcuts: action.payload });
    }
    case SHORTCUT_UPDATE_DONE: {
      let shortcuts = {...state.shortcuts};
      shortcuts[action.payload.id] = action.payload;
      return {...state, shortcuts: shortcuts};
    }
    case SHORTCUT_REMOVE_DONE: {
    let shortcuts = {...state.shortcuts};
    delete shortcuts[action.payload.id];
    return {...state, shortcuts: shortcuts};
    }

    default: {
      return state;
    }
  }
}

export const getAppState = (state: State) => state.app;
export const getShortcutEntities = (state: State) => state.app.shortcuts;

export const getShortcuts = createSelector(getAppState, getShortcutEntities, (appState, shortcuts) => {
  let arr: any[] = [];
  Object.keys(shortcuts).forEach((idx: any) => arr.push(shortcuts[idx]));
  return arr;
} );
// export const getShortcuts = (state: State) => {
//   let appState = state.app;
//   let arr: any[] = [];
//   let shortcuts: {[id: number]: any} = appState.shortcuts;
//   Object.keys(shortcuts).forEach((idx: any) => arr.push(shortcuts[idx]));
//   return arr;
// };
