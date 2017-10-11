import { Action, createSelector } from '@ngrx/store';
import * as folder from '../actions/folder';


export interface Folder {
  id: number,
  uuid: string,
  name: string,
  folders: Folder[]
}

export interface State {
  folders: {[id: number]: Folder},
  currentFolder: Folder | null,
  currentFolderPath: {id: number, label: string}[]
}

const initialState: State = {
  folders: {},
  currentFolder: null, // null stands for root folder
  currentFolderPath: []
};

// TODO
export function reducer(state = initialState, action: folder.Actions): State {
  switch (action.type) {
    case folder.FOLDERS_DELETED: {
      return state;
    }
    case folder.FOLDER_ADDED: {
      return {...state};
    }
    case folder.FOLDER_UPDATED: {
      return state;
    }
    case folder.SET_FOLDER_PATH: {
      let convertedPath = action['payload'];
      console.debug('folder Path: ', convertedPath);
      return {...state, currentFolderPath: convertedPath};
    }
    case folder.LOAD_SUCCESS: {
      return {...state, folders: action['payload']};
    }
    default:
      return state;
  }
}

export const getFolders = (state: State) => state.folders;
export const getCurrentFolderPath = (state: State) => state.currentFolderPath;

export const getFoldersTree = (state: State) => {
  // Convert original HASH folders to an sorted ARRAY folders
  let cloneFolders: any[] = [];
  Object.keys(state.folders).forEach((idx: any) => cloneFolders.push(state.folders[idx]));
  return cloneFolders;
};

export function mapFolderToItem(folder: Folder) {
  let item: any = {label: folder.name, icon: 'fa-folder-o'};
  return item;
}
