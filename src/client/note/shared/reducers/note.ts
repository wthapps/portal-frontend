import { createSelector, Store, Action } from '@ngrx/store';

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
  notes: {[id: number]: Note};
  currentNote: Note | null;
  noteHistory: { id: number | string, stackId: number, stack: Note[] }; // Lastest note is at index 0 in Note Undo stack
  folders: {[id: number]: Folder}; //{1 :{id: 1, name: "abc"}, 2 :{id: 2, name: "sdfsdf"}  }
  page: number;
  orderDesc: boolean;
  selectedObjects: {id: string, object_type: string}[];
  selectAll: boolean;
  viewMode: string;
};

export const noteInitialState: State = {
  notes: {},
  currentNote: null,
  noteHistory: {id: '', stackId: -1, stack: []},
  folders: {},
  page: 0,
  orderDesc: true,
  selectedObjects: [],
  selectAll: false,
  viewMode: VIEW_MODE.LIST,
};


// Reducer
export function reducer(state: State = noteInitialState, action: note.NoteActions): State {
  let stateClone = _.clone(state);
  switch (action.type) {
    case note.NOTE_ADDED: {
      let hNote: any = {};
      hNote[action['payload']['id']] = action['payload'];
      let notes = {...state.notes, hNote};
      return {...state, notes: notes, currentNote: action['payload']};
    }
    case note.MULTI_NOTES_ADDED: {
      let hNotes: any = action['payload'].reduce((acc: any, item: any) => {acc[item.id] = item; return acc;}, {});
      let notes: any = {...state.notes, ...hNotes};
      return Object.assign({}, state, {notes: notes});
    }
    case note.MULTI_NOTES_UPDATED: {
      let hNotes: any = action['payload'].reduce((acc: any, item: any) => {acc[item.id] = item; return acc;}, {});
      let notes3: any = {...state.notes, ...hNotes};

      return Object.assign({}, state, {notes: notes3});
    }
    case note.SET_FOLDERS: {
      let hFolders: any = action['payload'].reduce((acc: any, item: any) => {
        if (item.object_type == ITEM_TYPE.FOLDER)
          acc[item.id] = item;
        return acc;}, {});

      return Object.assign({}, state, {
        folders: hFolders
      });
    }
    case note.NOTE_UPDATED: {
      let hNote: any = {};
      let idx: any = action['payload']['id'];
      hNote[idx] = {...action['payload'], selected: state.notes[idx].selected};
      let notes4: any = {...state.notes, ...hNote};

      let noteStack: Note[] = [...state.noteHistory.stack];

      if(noteStack.length >= UNDO_STACK_SIZE) {
        noteStack.pop();
        noteStack.unshift(action['payload']);
      } else {
        noteStack.unshift(action['payload']);
      }

      return Object.assign({}, state, {notes: notes4,
        noteHistory: {stack: noteStack, stackId: 0}}
        );
    }
    case note.EDIT: {
      let idx: any = action['payload']['id'];
      let currentNote = idx ? state.notes[idx] : new Note();
      return {...state, currentNote: currentNote, noteHistory: {id: idx, stackId: 0, stack: []}};
    }
    case note.RESET_CURRENT_NOTE: {
      return {...state, currentNote: new Note(), noteHistory: {id: null, stackId: 0, stack: []}};
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
    case note.LOAD_SUCCESS: {
      let hNotes: any = action['payload'].reduce((acc: any, item: any) => {
        if (item.object_type == ITEM_TYPE.NOTE)
          acc[item.id] = item;
        return acc;}, {});
      let hFolders: any = action['payload'].reduce((acc: any, item: any) => {
        if (item.object_type == ITEM_TYPE.FOLDER)
          acc[item.id] = item;
        return acc;}, {});

      return Object.assign({}, state, {
        notes: hNotes,
        folders: hFolders,
        selectedObjects: noteInitialState.selectedObjects,
        selectAll: noteInitialState.selectAll});
    }
    case note.NOTES_DELETED: {
      let noteIds: any = action['payload'].map((n: any) => { if(n['object_type'] == ITEM_TYPE.NOTE) return n.id});
      let folderIds: any = action['payload'].map((n: any) => { if(n['object_type'] == ITEM_TYPE.FOLDER) return n.id});
      let notes2 = {...state.notes};
      noteIds.forEach((n: any) => delete notes2[n]);
      let folders2 = {...state.folders};
      folderIds.forEach((f: any) => delete folders2[f]);

      return Object.assign({}, state, {
        notes: notes2,
        folders: folders2,
        selectedObjects: noteInitialState.selectedObjects,
        selectAll: noteInitialState.selectAll
      });
    }
    case note.CHANGE_SORT_ORDER: {
      let rOrderDesc = !state.orderDesc;
      return {...state, orderDesc: rOrderDesc};
    }
    case note.SELECT: {
      let selected: any = action['payload'];
      let index = state.selectedObjects.findIndex((o: any) => o.id == selected.id && o.object_type == selected.object_type);
      let newselectedObjects: any[]= [];
      if(index == -1)
        newselectedObjects = [...state.selectedObjects, selected];
      else
        newselectedObjects = state.selectedObjects.filter((o: any, idx: number) => idx !== index);

      // Update NOTE/FOLDER state
      if(selected.object_type == ITEM_TYPE.NOTE) {
        let notes: any = {...state.notes};
        notes[selected.id].selected = !notes[selected.id].selected;
        return {...state, selectedObjects: newselectedObjects, notes: notes};
      }
      if(selected.object_type == ITEM_TYPE.FOLDER) {
        let folders: any = {...state.folders};
        folders[selected.id]['selected'] = !folders[selected.id]['selected'];
        return {...state, selectedObjects: newselectedObjects, folders: folders};
      }
      return {...state};
    }
    case note.SELECT_ALL: {
      let selectedObjects: any[] = [];
      let selectAll: boolean = false;
      let inotes: any = {};
      let folders: any = {};
      if(state.selectedObjects.length !== Object.keys(state.folders).length + Object.keys(state.notes).length) {
        Object.keys(state.notes).forEach((idx: any) => {
          selectedObjects.push({id: idx, object_type: ITEM_TYPE.NOTE});
          inotes[idx] = {...state.notes[idx], selected: true};
        });
        Object.keys(state.folders).forEach((idx: any) => {
          selectedObjects.push({id: idx, object_type: ITEM_TYPE.FOLDER});
          folders[idx] = {...state.folders[idx], selected: true};
        });
        selectAll = true;
      } else {
        Object.keys(state.notes).forEach((idx: any) => {
          inotes[idx] = {...state.notes[idx], selected: false};
        });
        Object.keys(state.folders).forEach((idx: any) => {
          folders[idx] = {...state.folders[idx], selected: false};
        });

      }
      return Object.assign({}, state, {selectedObjects: selectedObjects, selectAll: selectAll, notes: inotes, folders: folders});
    }
    case note.CHANGE_VIEW_MODE: {
      return {...state, viewMode: action.payload};
    }
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
    case ITEM_TYPE.NOTE: {
      return state.notes[obj.id];
    }
    case ITEM_TYPE.FOLDER: {
      return state.folders[obj.id];
    }
    default:
      return {};
  }
}

export const getSortedNotes = createSelector(getNotes, getOrderDesc, (notes, orderDesc) => {
  // Convert original HASH notes to an sorted ARRAY notes
  let cloneNotes: any[] = [];
  Object.keys(notes).forEach((idx: any) => cloneNotes.push(notes[idx]));
  return cloneNotes.sort((a: Note, b: Note) => compareBy(a, b, orderDesc, 'title'));
});

export const getSortedFolders = createSelector(getFolders, getOrderDesc, (folders, orderDesc) => {
  // Convert original HASH folders to an sorted ARRAY folders
  let cloneFolders: any[] = [];
  Object.keys(folders).forEach((idx: any) => cloneFolders.push(folders[idx]));
  return cloneFolders.sort((a: Folder, b: Folder) => compareBy(a, b, orderDesc, 'name'));
});

export function compareBy(objA: any, objB: any, orderDesc: boolean, field: string = 'title'): number {
  let o = orderDesc ? 1 : -1;
  if((objA.title > objB.title))
    return 1*o;
  if((objA.title < objB.title))
    return -1*o;

  return 0;
}
