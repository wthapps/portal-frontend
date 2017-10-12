

import { Folder } from '../reducers/folder';
import { Action } from '@ngrx/store';
export const UPDATE = '[Folder] Update';
export const FOLDERS_UPDATED = '[Folders] Updated';
export const FOLDER_UPDATED = '[Folder] Updated';
export const ADD = '[Folder] Add';
export const FOLDER_ADDED = '[Folder] Added';
export const DELETE = '[Folder] Delete';
export const MULTI_DELETE = '[Folder] Multi Delete';
export const FOLDERS_DELETED = '[Folders] Deleted';
export const LOAD_ALL = '[Folder] Load All';
export const LOAD_SUCCESS = '[Folder] Load Success';
export const SELECT = '[Folder] Select';
export const DESELECT_ALL = '[Folder] Deselect All';
export const CHANGE_SORT_ORDER = '[Folder] Change Sort Order';
export const SET_CURRENT = '[Folder] Set Current';
export const SET_FOLDER_PATH = '[Folder] Set Folder Path';
export const UPDATE_CURRENT = '[Folder] Update Current Folder';

// Actions

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public payload: Folder) {
  }
}

export class FoldersUpdated implements Action {
  readonly  type = FOLDERS_UPDATED;

  constructor(public payload: Folder[]) {
  }
}

export class FolderUpdated implements Action {
  readonly  type = FOLDER_UPDATED;

  constructor(public payload: Folder[]) {
  }
}


export class Add implements Action {
  readonly type = ADD;

  constructor(public payload: Folder) {
  }
}

export class FolderAdded implements Action {
  readonly type = FOLDER_ADDED;

  constructor(public payload: Folder) {
  }
}

export class LoadAll implements Action {
  readonly type = LOAD_ALL;
}

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: Folder[]) {
  }
}

export class Delete implements Action {
  readonly type = DELETE;

  constructor(public payload: number[]) {
  }
}

export class MultiDelete implements Action {
  readonly type = MULTI_DELETE;

  constructor() {
  }
}

export class FoldersDeleted implements Action {
  readonly type = FOLDERS_DELETED;

  constructor(public payload: Folder[]) {
  }
}

export class Select implements Action {
  readonly type = SELECT;

  constructor(public payload: number) {
  }
}

export class DeselectAll implements Action {
  readonly type = DESELECT_ALL;
}

export class ChangeSortOrder implements Action {
  readonly type = CHANGE_SORT_ORDER;

}

export class UpdateCurrentFolder implements Action {
  readonly type = UPDATE_CURRENT;

  constructor(public payload: number) {
  }
}

export class SetCurrentFolder implements Action {
  readonly type = SET_CURRENT;

  constructor(public payload: number) {

  }
}

export class SetCurrentFolderPath implements Action {
  readonly type = SET_FOLDER_PATH;

  constructor(public payload: any) {

  }
}

// TODO: Add RouterState | Activated Route
export type Actions = Add | Update | FoldersUpdated | FolderUpdated | FolderAdded | Delete | MultiDelete | FoldersDeleted | LoadAll | LoadSuccess | ChangeSortOrder
  | Select | DeselectAll | SetCurrentFolder | SetCurrentFolderPath | UpdateCurrentFolder;
