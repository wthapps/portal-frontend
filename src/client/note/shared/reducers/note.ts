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
  selectedObjects: {id: string, object_type: string}[];
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
  selectedObjects: [],
  selectAll: false,
  viewMode: VIEW_MODE.LIST,
};


// Reducer
export function reducer(state: State = noteInitialState, action: note.NoteActions): State {
  switch (action.type) {
    case note.NOTE_ADDED: {
      let notes = [...state.notes, action['payload']];
      // return Object.assign({}, state, {notes: notes, currentNote: action['payload']});
      return {...state, notes: notes, currentNote: action['payload']};
    }
    case note.MULTI_NOTES_ADDED: {
      let notes = [...state.notes, ...action['payload']];
      return Object.assign({}, state, {notes: notes});
    }
    case note.MULTI_NOTES_UPDATED: {
      let notes3 = [...state.notes];
      action.payload.forEach((uNote: Note) => {
        let idx: any =  notes3.findIndex((n: any) => n.id == uNote.id);
        if(idx > -1)
          notes3.splice(idx, 1, uNote);
      });

      return Object.assign({}, state, {notes: notes3});
    }
    case note.NOTE_UPDATED: {
      let notes4 = [...state.notes];
      let uNote: Note = action.payload;
      let idx: any =  notes4.findIndex((n: any) => n.id == uNote.id);
      if(idx > -1)
        notes4.splice(idx, 1, uNote);
      let noteStack: Note[] = [...state.noteHistory.stack];

      if(noteStack.length >= UNDO_STACK_SIZE) {
        noteStack.pop();
        noteStack.unshift(uNote);
      } else {
        noteStack.unshift(uNote);
      }

      return Object.assign({}, state, {notes: notes4,
        noteHistory: {stack: noteStack, stackId: 0},
        selectedObjects: noteInitialState.selectedObjects,
        selectAll: noteInitialState.selectAll});
    }
    case note.EDIT: {
      return {...state, currentNote: action.payload, noteHistory: {id: action.payload.id, stackId: 0, stack: []}};
    }
    case note.UNDO: {
      let stackId = state.noteHistory.stackId++;
      let currentNote = state.noteHistory.stack[stackId];
      let noteHistory = {...state.noteHistory, stackId: stackId};
      return {...state, currentNote: currentNote, noteHistory: noteHistory};
    }
    case note.REDO: {
      let stackId = state.noteHistory.stackId > 0 ? state.noteHistory.stackId-- : 0;
      let currentNote = state.noteHistory.stack[stackId];
      let noteHistory = {...state.noteHistory, stackId: stackId};
      return {...state, currentNote: currentNote, noteHistory: noteHistory};
    }
    case note.LOAD_SUCCESS:
      let items = [...action['payload']];
      return Object.assign({}, state, {
        notes: items.filter((i: any) => i.object_type == ITEM_TYPE.NOTE),
        folders: items.filter((i: any) => i.object_type == ITEM_TYPE.FOLDER),
        selectedObjects: noteInitialState.selectedObjects,
        selectAll: noteInitialState.selectAll});
    case note.NOTES_DELETED:
      let noteIds: any = action['payload'].map((n: any) => { if(n['object_type'] == ITEM_TYPE.NOTE) return n.id});
      let folderIds: any = action['payload'].map((n: any) => { if(n['object_type'] == ITEM_TYPE.FOLDER) return n.id});
      let notes2 = [...state.notes].filter((n: any) => noteIds.indexOf(n.id) == -1);
      let folders2 = [...state.folders].filter((n: any) => folderIds.indexOf(n.id) == -1);
      return Object.assign({}, state, {
        notes: notes2,
        folders: folders2,
        selectedObjects: noteInitialState.selectedObjects,
        selectAll: noteInitialState.selectAll
      });
    case note.CHANGE_SORT_ORDER:
      let rOrderDesc = !state.orderDesc;
      return Object.assign({}, state, { orderDesc: rOrderDesc});
    case note.SELECT:
      let selected = action['payload'];
      let index = state.selectedObjects.findIndex((o: any) => o.id == selected.id && o.object_type == selected.object_type);
      let newselectedObjects: any[]= [];
      if(index == -1)
        newselectedObjects = [...state.selectedObjects, selected];
      else
        newselectedObjects = state.selectedObjects.filter((o: any, idx: number) => idx !== index);


      return Object.assign({}, state, {selectedObjects: newselectedObjects});
    case note.SELECT_ALL:
      let selectedObjects: any[] = [];
      let selectAll: boolean = false;
      let inotes: any[] = state.notes;
      let folders: any[] = state.folders;
      if(state.selectedObjects.length !== state.folders.length + state.notes.length) {
        selectedObjects = [...state.folders, ...state.notes];
        selectAll = true;
        inotes.map((n: any) => Object.assign(n, {'selected': true}));
        folders.map((n: any) => Object.assign(n, {'selected': true}));
      } else {
        inotes.map((n: any) => Object.assign(n, {'selected': false}));
        folders.map((n: any) => Object.assign(n, {'selected': false}));
      }
      return Object.assign({}, state, {selectedObjects: selectedObjects, selectAll: selectAll, notes: inotes, folders: folders});
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
export const getSelectedObjects = (state: State ) => state.selectedObjects;
export const getViewMode = (state: State ) => state.viewMode;
export const getCurrentNote = (state: State ) => state.currentNote;


export const getFirstSelectedObject = (state: State) => {
  let obj: any = state.selectedObjects[0] || {};

  // TODO: Testing
  switch(obj['object_type']) {
    case 'note': {
      let idx: any = state.notes.findIndex((o: any) => o.id == obj.id && o.object_type == obj.object_type)
      if(idx > -1)
        return state.notes[idx];
      else
        return {};
    }
    case 'folder': {
      let idx: any = state.folders.findIndex((o: any) => o.id == obj.id && o.object_type == obj.object_type)
      if(idx > -1)
        return state.folders[idx];
      else
        return {};
    }
    default:
      return {};
  }
}

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
