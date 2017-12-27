import { ActionReducer, Action } from '@ngrx/store';
import { NoteContext } from "note/shared/models/context.model";

export const SET_CONTEXT = '[NOTE] SET_CONTEXT';

declare let _: any;
let empty: any = function (): any {
  return new NoteContext();
};
export function reducer(state: any = empty(), action: any) {
  let stateClone: NoteContext = new NoteContext();
  stateClone.setContext(state);
  switch (action.type) {
    case SET_CONTEXT:
      stateClone.setContext(action.payload);
      return stateClone;
    default:
      return state;
  }
}

export const getContext = (state: any) => state.context;
export const getSortOptionContext = (state: any) => state.context.sort;
