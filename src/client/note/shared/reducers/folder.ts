import { Action } from '@ngrx/store';
import * as folder from '../actions/folder';


export interface Folder {
  id: number,
  uuid: string,
  name: string,
  folders: Folder[]
}

export interface State {
  folders: Folder[]
}

const initialState: State = {
  folders: [],
};

// TODO
export function reducer(state = initialState, action: folder.Actions): State {
  switch (action.type) {
    case folder.FOLDERS_DELETED:
      return state;

    case folder.FOLDER_ADDED:
      return state;

    default:
      return state;
  }
}

export const getFolders = (state: State) => state.folders;
