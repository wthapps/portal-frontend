import { createSelector, Store, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { ActivatedRouteSnapshot, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { User } from '../../../core/shared/models/user.model';
import { NoteService } from '../../my-note/notes/note.service';
import { ZNoteService } from '../services/note.service';
import * as note from '../actions/note';
import { Note } from '../../../core/shared/models/note.model';
import { Folder } from './folder';

declare let _: any;

// Constants
export const PAGE_SIZE = 10;
export const ITEM_TYPE = {
  NOTE: 'note',
  FOLDER: 'folder'
}

// State
export interface  Filters {
  folder: string };
// export type State = { notes: {[id: number]: Note}, page: number, orderDesc: boolean, filters: Filters };

export interface State {
  notes: Note[] | null;
  folders: Folder[] | null;
  page: number;
  orderDesc: boolean;
  selectedIds: {id: string, object_type: string}[];
  selectAll: boolean;
};

export const noteInitialState: State = {
  notes: [],
  folders: [],
  page: 0,
  orderDesc: true,
  selectedIds: [],
  selectAll: false
};


// Reducer
export function reducer(state: State = noteInitialState, action: note.NoteActions): State {
  switch (action.type) {
    case note.NOTES_ADDED: {
      const notes = [...state.notes, ...action['payload']];
      return Object.assign({}, state, {notes: notes});
    }
    case note.LOAD_SUCCESS:
      const items = [...action['payload']];
      return Object.assign({}, state, {
        notes: items.filter((i: any) => i.object_type == ITEM_TYPE.NOTE),
        folders: items.filter((i: any) => i.object_type == ITEM_TYPE.FOLDER) });
    case note.NOTES_DELETED:
      const noteIds: any = action['payload'].map((n: any) => { if(n['object_type'] == ITEM_TYPE.NOTE) return n.id});
      const folderIds: any = action['payload'].map((n: any) => { if(n['object_type'] == ITEM_TYPE.FOLDER) return n.id});
      const notes2 = [...state.notes].filter((n: any) => noteIds.indexOf(n.id) == -1);
      const folders2 = [...state.folders].filter((n: any) => folderIds.indexOf(n.id) == -1);
      return Object.assign({}, state, {
        notes: notes2,
        folders: folders2,
        selectedIds: noteInitialState.selectedIds,
        selectAll: noteInitialState.selectAll
      });
    case note.CHANGE_SORT_ORDER:
      const rOrderDesc = !state.orderDesc;
      return Object.assign({}, state, { orderDesc: rOrderDesc});
    case note.SELECT:
      const selected = action['payload'];
      const index = state.selectedIds.findIndex((o: any) => o.id == selected.id && o.object_type == selected.object_type);
      let newSelectedIds: any[]= [];
      if(index == -1)
        newSelectedIds = [...state.selectedIds, selected];
      else
        newSelectedIds = state.selectedIds.filter((o: any, idx: number) => idx !== index);


      return Object.assign({}, state, {selectedIds: newSelectedIds});
    case note.SELECT_ALL:
      let selectedIds: any[] = [];
      let selectAll: boolean = false;
      let inotes: any[] = state.notes;
      let folders: any[] = state.folders;
      if(state.selectedIds.length !== state.folders.length + state.notes.length)
      {
        selectedIds = [...state.folders, ...state.notes]
        selectAll = true;
        inotes.map((n: any) => Object.assign(n, {'selected': true}));
        folders.map((n: any) => Object.assign(n, {'selected': true}));
      } else {
        inotes.map((n: any) => Object.assign(n, {'selected': false}));
        folders.map((n: any) => Object.assign(n, {'selected': false}));
      }
      return Object.assign({}, state, {selectedIds: selectedIds, selectAll: selectAll, notes: inotes, folders: folders});
    default: {
      return state;
    }
  }
}

export const getNotes = (state: State ) => state.notes;
export const getPage = (state: State ) => state.page;
export const getOrderDesc = (state: State ) => state.orderDesc;
export const getFolders = (state: State ) => state.folders;
export const getSelectAll = (state: State ) => state.selectAll;
export const getSelectedIds = (state: State ) => state.selectedIds;

export const getSortedNotes = createSelector(getNotes, getOrderDesc, (notes, orderDesc) => {
  const cloneNotes = [...notes];
  return cloneNotes.sort((a: Note, b: Note) => compareBy(a, b, orderDesc, 'title'));
});

export const getSortedFolders = createSelector(getFolders, getOrderDesc, (folders, orderDesc) => {
  return [...folders].sort((a: Folder, b: Folder) =>compareBy(a, b, orderDesc, 'name'));
});

export function compareBy(objA: any, objB: any, orderDesc: boolean, field: string = 'title'): number {
  let o = orderDesc ? 1 : -1;
  if((objA.title > objB.title))
    return 1*o;
  if((objA.title < objB.title))
    return -1*o;

  return 0;

}
