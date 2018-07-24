import { NoteContext } from "@notes/shared/models/context.model";

export const SET_CONTEXT = '[NOTE] SET_CONTEXT';
export const SET_CONTEXT_BY_FOLDER_PATHS = '[NOTE] SET_CONTEXT_BY_FOLDER_PATHS';

declare let _: any;
let empty: any = function (): any {
  return new NoteContext();
};
export function reducer(state: any = empty(), action: any) {
  let stateClone: NoteContext = new NoteContext();
  stateClone.setContext(state);
  switch (action.type) {
    case SET_CONTEXT:
      return {...stateClone, ...action.payload};
    case SET_CONTEXT_BY_FOLDER_PATHS:
      stateClone.setContext(action.payload);
      if (!action.payload || action.payload.length == 0) {
        return state;
      }
      let folder = action.payload[action.payload.length -1]
      let permissions = {
        edit: folder.permission !== 'view',
        enableEdit: folder.permission !== 'view',
      };
      return  {...stateClone, permissions: permissions};
    default:
      return state;
  }
}

export const getContext = (state: any) => state.context;
export const getCurrentPageContext = (state: any) => state.context.page;
export const getSortOptionContext = (state: any) => state.context.sort;
export const getGroupByContext = (state: any) => state.context.groupBy;
