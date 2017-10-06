import { createSelector, Store, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { ActivatedRouteSnapshot, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { User } from '../../../core/shared/models/user.model';
import { ZNoteService } from '../services/note.service';
import * as note from '../actions/note';
import { Note } from '../../../core/shared/models/note.model';
import { Folder } from './folder';

declare let _: any;

// Constants
export const PAGE_SIZE = 10;
export const UNDO_STACK_SIZE = 10;
export const ITEM_TYPE = {
  NOTE: 'note',
  FOLDER: 'folder'
}
export const VIEW_MODE = {
  LIST: 'list',
  GRID: 'grid'
};

// State
export interface  Filters {
  folder: string };

export interface State {
  notes: Note[] | null;
  currentNote: Note | null;
  noteHistory: { id: number | string, stackId: number, stack: Note[] }; // Lastest note is at index 0 in Note Undo stack
  folders: Folder[] | null;
  page: number;
  orderDesc: boolean;
  selectedIds: {id: string, object_type: string}[];
  selectAll: boolean;
  viewMode: string;
};

export const noteInitialState: State = {
  notes: [],
  currentNote: null,
  noteHistory: {id: '', stackId: -1, stack: []},
  folders: [],
  page: 0,
  orderDesc: true,
  selectedIds: [],
  selectAll: false,
  viewMode: VIEW_MODE.LIST,
};


// Reducer
export function reducer(state: State = noteInitialState, action: note.NoteActions): State {
  switch (action.type) {
    case note.NOTE_ADDED: {
      const notes = [...state.notes, action['payload']];
      // return Object.assign({}, state, {notes: notes, currentNote: action['payload']});
      return {...state, notes: notes, currentNote: action['payload']};
    }
    case note.MULTI_NOTES_ADDED: {
      const notes = [...state.notes, ...action['payload']];
      return Object.assign({}, state, {notes: notes});
    }
    case note.MULTI_NOTES_UPDATED: {
      const notes3 = [...state.notes];
      action.payload.forEach((uNote: Note) => {
        let idx: any =  notes3.findIndex((n: any) => n.id == uNote.id);
        if(idx > -1)
          notes3.splice(idx, 1, uNote);
      });

      return Object.assign({}, state, {notes: notes3});
    }
    case note.NOTE_UPDATED: {
      const notes3 = [...state.notes];
      let uNote: Note = action.payload;
      let idx: any =  notes3.findIndex((n: any) => n.id == uNote.id);
      if(idx > -1)
        notes3.splice(idx, 1, uNote);
      let noteStack: Note[] = [...state.noteHistory.stack];

      if(noteStack.length >= UNDO_STACK_SIZE) {
        noteStack.pop();
        noteStack.unshift(uNote);
      } else {
        noteStack.unshift(uNote);
      }

      return Object.assign({}, state, {notes: notes3, noteHistory: {stack: noteStack, stackId: 0}});
    }
    case note.EDIT: {
      return {...state, currentNote: action.payload, noteHistory: {id: action.payload.id, stackId: 0, stack: []}};
    }
    case note.UNDO: {
      const stackId = state.noteHistory.stackId++;
      const currentNote = state.noteHistory.stack[stackId];
      const noteHistory = {...state.noteHistory, stackId: stackId};
      return {...state, currentNote: currentNote, noteHistory: noteHistory};
    }
    case note.REDO: {
      const stackId = state.noteHistory.stackId > 0 ? state.noteHistory.stackId-- : 0;
      const currentNote = state.noteHistory.stack[stackId];
      const noteHistory = {...state.noteHistory, stackId: stackId};
      return {...state, currentNote: currentNote, noteHistory: noteHistory};
    }
    case note.LOAD_SUCCESS:
      const items = [...action['payload']];
      return Object.assign({}, state, {
        notes: items.filter((i: any) => i.object_type == ITEM_TYPE.NOTE),
        folders: items.filter((i: any) => i.object_type == ITEM_TYPE.FOLDER),
        selectedIds: noteInitialState.selectedIds,
        selectAll: noteInitialState.selectAll});
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
      if(state.selectedIds.length !== state.folders.length + state.notes.length) {
        selectedIds = [...state.folders, ...state.notes];
        selectAll = true;
        inotes.map((n: any) => Object.assign(n, {'selected': true}));
        folders.map((n: any) => Object.assign(n, {'selected': true}));
      } else {
        inotes.map((n: any) => Object.assign(n, {'selected': false}));
        folders.map((n: any) => Object.assign(n, {'selected': false}));
      }
      return Object.assign({}, state, {selectedIds: selectedIds, selectAll: selectAll, notes: inotes, folders: folders});
    case note.CHANGE_VIEW_MODE:
      return {...state, viewMode: action.payload};
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
export const getViewMode = (state: State ) => state.viewMode;
export const getCurrentNote = (state: State ) => state.currentNote;


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
