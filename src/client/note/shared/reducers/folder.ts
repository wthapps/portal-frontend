import { Action, createSelector } from '@ngrx/store';
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
      return {...state};

    case folder.FOLDER_UPDATED:
      return state;

    case folder.LOAD_SUCCESS:
      return {...state, folders: action['payload']};

    default:
      return state;
  }
}

export const getFolders = (state: State) => state.folders;

export const getFoldersTree = (state: State) => state.folders;

// export const getFoldersTree = (state: State) => {
//   // let items: any[] = [];
//   // state.folders.forEach((f: any )=> items.push(mapFolderToItem(folder)));
//   let items: any[] = state.folders.map((f: any )=> mapFolderToItem(folder));
//   console.debug('getFoldersTree: ', items);
//   return items;
// };

// export const getFoldersTree = createSelector(getFolders, (folders: State.folders) => {
//   let items: any[] = [];
//   folders.forEach((f: any )=> items.push(mapFolderToItem(folder)));
//   console.debug('getFoldersTree: ', items);
//   return items;
// });

export function mapFolderToItem(folder: Folder) {
  //   for (let folder of event.payload) {
  //     if (!folder.parent_id) {
  //       folder.label = folder.name;
  //       folder.icon = 'fa-folder-o';
  //       folder.items = [];
  //       folder.command = (event: any)=> this.loadMenu(event);
  //       this.noteFoldersTree.push(folder);
  //     }
  //   }

  let item: any = {label: folder.name, icon: 'fa-folder-o'};

  // if(folder.folders) {
  //   item.items = [];
  //   folder.folders.forEach((sub: Folder) => {
  //     item.items.push(mapFolderToItem(sub));
  //   });
  // }
  return item;
}
