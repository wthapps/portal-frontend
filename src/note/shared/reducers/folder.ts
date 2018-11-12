import { Action, createSelector } from '@ngrx/store';
import * as fromFolder from '../actions/folder';

export interface Folder {
  id: number;
  uuid: string;
  name: string;
  folders: Folder[];
}

export interface State {
  folders: { [id: number]: Folder };
  currentFolder: Folder | null;
  currentFolderPath: { id: number, label: string }[];
}

export const initialState: State = {
  folders: {},
  currentFolder: null, // null stands for root folder
  currentFolderPath: []
};

// TODO
export function reducer(
  state = initialState,
  action: fromFolder.Actions
): State {
  switch (action.type) {
    case fromFolder.FOLDERS_DELETED: {
      return state;
    }
    case fromFolder.FOLDER_ADDED: {
      return { ...state };
    }
    case fromFolder.FOLDER_UPDATED: {
      return { ...state, folders: action['payload'] };
    }
    case fromFolder.SET_FOLDER_PATH_AND_UPDATE_CURRENT: {
      const convertedPath: any[] = action['payload'];
      const curr: any = convertedPath[convertedPath.length - 1];
      return {
        ...state,
        currentFolderPath: convertedPath,
        currentFolder: curr
      };
    }
    case fromFolder.UPDATE_FOLDER_PATH: {
      const folderPath: any = [...state.currentFolderPath];
      folderPath.forEach((val: any, idx: any) => {
        if (val.id === action.payload.id) {
          folderPath[idx] = action.payload;
        }
      });
      return { ...state, currentFolderPath: folderPath };
    }
    case fromFolder.LOAD_SUCCESS: {
      return { ...state, folders: action['payload'] };
    }
    default:
      return state;
  }
}

export const getFolders = (state: State) => state.folders;
export const getCurrentFolder = (state: State) => state.currentFolder;
export const getCurrentFolderPath = (state: State) => state.currentFolderPath;

export const getFoldersTree = (state: State) => {
  // Convert original HASH folders to an sorted ARRAY folders
  const cloneFolders: any[] = [];
  Object.keys(state.folders).forEach((idx: any) =>
    cloneFolders.push(state.folders[idx])
  );
  return cloneFolders;
};

export function mapFolderToItem(folder: Folder) {
  const item: any = { label: folder.name, icon: 'fa-folder-o' };
  return item;
}
