import { ActionReducer, Action } from '@ngrx/store';
import { Context } from "@shared/shared/models/context.model";

export const SET_PROGRESS_CONTEXT = '[NOTE] SET_PROGRESS_CONTEXT';
export const RESET_PROGRESS_CONTEXT = '[NOTE] RESET_PROGRESS_CONTEXT';

declare let _: any;
let defaultValue: any = {
  hasCloseIcon: true,
  loading: false,
  open: false,
  done: false,
  enableAction: false,
  actionText: "",
  callback: null,
  textMessage: "",
  failed: false
};
let empty: any = function (): any {
  let context = new Context();
  context.setContext(defaultValue)
  return context;
};
export function reducer(state: any = empty(), action: any) {
  let stateClone: Context = new Context();
  stateClone.setContext(defaultValue);
  switch (action.type) {
    case SET_PROGRESS_CONTEXT:
      stateClone.setContext(action.payload);
      return stateClone;
    case RESET_PROGRESS_CONTEXT:
      stateClone.setContext(defaultValue);
      return stateClone;
    default:
      return state;
  }
}

export const getProgressContext = (state: any) => state.progressContext;
