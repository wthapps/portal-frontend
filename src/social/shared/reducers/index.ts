
import { createSelector } from '@ngrx/store';
export const SHORTCUT_LOAD = '[SOCIAL] SHORTCUT LOAD';
export const SHORTCUT_LOAD_DONE = '[SOCIAL] SHORTCUT LOAD DONE';
export const SHORTCUT_LOAD_FAILED = '[SOCIAL] SHORTCUT LOAD FAILED';
export const SHORTCUT_UPDATE = '[SOCIAL] UPDATE SHORTCUT';
export const SHORTCUT_UPDATE_DONE = '[SOCIAL] UPDATE SHORTCUT DONE';
export const SHORTCUT_UPDATE_FAILED = '[SOCIAL] UPDATE SHORTCUT FAILED';
export const SHORTCUT_ADD = '[SOCIAL] ADD SHORTCUT';
export const SHORTCUT_ADD_MULTI = '[SOCIAL] ADD SHORTCUT MULTIPLE';
export const SHORTCUT_ADD_MULTI_DONE = '[SOCIAL] ADD SHORTCUT MULTIPLE DONE';
export const SHORTCUTS_REMOVE = '[SOCIAL] REMOVE SHORTCUTS';
export const SHORTCUTS_REMOVE_DONE = '[SOCIAL] REMOVE SHORTCUTS DONE';


export const SO_PROFILE_LOAD = '[SOCIAL] SO PROFILE LOAD';
export const SO_PROFILE_UPDATE = '[SOCIAL] SO PROFILE UPDATE';
export const SO_PROFILE_UPDATE_DONE = '[SOCIAL] SO PROFILE UPDATE DONE';


export const COMMON_FAILED = '[SOCIAL] COMMON FAILED';

export interface AppState {
  shortcuts: {[id: number]: any};
  soProfile: any,
  selectedIds: number[];
};

// export type AppState = { shortcuts: {[id: number]: any}, selectedIds: number[] };
export type State = {app: AppState };

export const socialInitialState: AppState = {
  shortcuts: {},
  soProfile: {},
  selectedIds: []
}

export function appReducer(state = socialInitialState, action: any): AppState {
  switch (action.type) {
    case SHORTCUT_LOAD_DONE: {
      return {...state, shortcuts: action.payload};
      // return Object.assign({}, state, { shortcuts: action.payload });
    }
    case SHORTCUT_UPDATE_DONE: {
      let shortcuts = {...state.shortcuts};
      shortcuts[action.payload.id] = action.payload;
      return {...state, shortcuts: shortcuts};
    }
    case SHORTCUT_ADD_MULTI_DONE: {
      let shortcuts = {...state.shortcuts, ...action.payload};
      return {...state, shortcuts: shortcuts};
    }
    case SHORTCUTS_REMOVE_DONE: {
    let shortcuts = {...state.shortcuts};
    action.payload.forEach(id => delete shortcuts[id]);
    return {...state, shortcuts: shortcuts};
    }

    case SO_PROFILE_UPDATE_DONE: {
      return {...state, soProfile: action.payload};
    }

    default: {
      return state;
    }
  }
}

export const getAppState = (state: State) => state.app;
export const getShortcutEntities = (state: State) => state.app.shortcuts;
export const getSoProfile = (state: State) => state.app.soProfile;

export const getShortcuts = createSelector(getAppState, getShortcutEntities, (appState, shortcuts) => {
  let arr: any[] = [];
  Object.keys(shortcuts).forEach((idx: any) => arr.push(shortcuts[idx]));
  return arr.sort((a: any, b: any) => compareBy(a, b, true, 'name'));;
} );


function compareBy(objA: any, objB: any, orderDesc: boolean, field: string = 'name'): number {
  if (!objA || !objB) return;
  let o = orderDesc ? 1 : -1;
  if(objA[field] > objB[field])
    return 1*o;
  if(objA[field] < objB[field])
    return -1*o;

  return 0;
}
