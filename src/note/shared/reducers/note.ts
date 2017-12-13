import { createSelector, Store, Action } from '@ngrx/store';

import * as note from '../actions/note';
import { Note } from '@shared/shared/models/note.model';
import { Folder } from './folder';

// declare let _: any;

// Constants
export const PAGE_SIZE = 10;
export const UNDO_STACK_SIZE = 10;
export const ITEM_TYPE = {
  NOTE: 'note',
  FOLDER: 'folder'
};
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
  pageNo: number;
  orderDesc: boolean;
  sortOption: {field: string, desc: boolean};
  selectedObjects: {id: string, object_type: string, parent_id: number}[];
  selectAll: boolean;
  viewMode: string;
  loading: boolean;
  loaded: boolean;
  listPermission: { canAdd: boolean};
};

export const noteInitialState: State = {
  notes: {},
  currentNote: null,
  noteHistory: {id: '', stackId: -1, stack: []},
  folders: {},
  pageNo: 0,
  orderDesc: true,
  sortOption: {field: 'name', desc: true},
  selectedObjects: [],
  selectAll: false,
  viewMode: VIEW_MODE.LIST,
  loading: false,
  loaded: false,
  listPermission: { canAdd: true},
};


// Reducer
export function reducer(state: State = noteInitialState, action: note.NoteActions): State {
  // let stateClone = _.clone(state);
  switch (action.type) {
    case note.NOTE_ADDED: {
      let hNote: any = {};
      hNote[action['payload']['id']] = action['payload'];
      let notes = state.listPermission.canAdd ? {...state.notes, hNote} : {...state.notes};
      return {...state, notes: notes, currentNote: action['payload']};
    }
    case note.MULTI_NOTES_ADDED: {
      let hNotes: any = action['payload'].reduce((acc: any, item: any) => {
        if (item.object_type == ITEM_TYPE.NOTE)
          acc[item.id] = item;
        return acc;}, {});
      let hFolders: any = action['payload'].reduce((acc: any, item: any) => {
        if (item.object_type == ITEM_TYPE.FOLDER)
          acc[item.id] = item;
        return acc;}, {});

      let notes: any = state.listPermission.canAdd ? {...state.notes, ...hNotes} : {...state.notes};
      let folders : any = state.listPermission.canAdd ? {...state.folders, ...hFolders} : {...state.folders};

      return Object.assign({}, state, {notes: notes, folders: folders});
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
        folders: {...state.folders, ...hFolders}
      });
    }
    case note.NOTE_UPDATED: {
      let hNote: any = {};
      hNote[action.payload.id] = action.payload;
      let existed: boolean = state.notes[action.payload.id] != undefined;
      let notes4: any = (state.listPermission.canAdd && existed) ? {...state.notes, ...hNote}: {...state.notes};

      // let noteStack: Note[] = [...state.noteHistory.stack];
      // let noteStack: Note[] = state.noteHistory.stack.slice(state.noteHistory.stackId);
      //
      // if(noteStack.length >= UNDO_STACK_SIZE) {
      //   noteStack.pop();
      //   noteStack.unshift(action['payload']);
      // } else {
      //   noteStack.unshift(action['payload']);
      // }

      return Object.assign({}, state, {notes: notes4,
        // noteHistory: {stack: noteStack, stackId: 0}}
        );
    }
    case note.EDIT: {
      let idx: any = action['payload']['id'];
      let currentNote = idx ? state.notes[idx] : new Note();
      return {...state, currentNote: currentNote, noteHistory: {id: idx, stackId: 0, stack: [currentNote]}};
    }
    case note.RESET_CURRENT_NOTE: {
      return {...state, currentNote: new Note(), noteHistory: {id: null, stackId: 0, stack: []}};
    }
    // case note.UNDO: {
    //   let stackId =  (state.noteHistory.stackId + 1 < state.noteHistory.stack.length ) ? state.noteHistory.stackId + 1 : state.noteHistory.stackId;
    //   let currentNote = state.noteHistory.stack[stackId];
    //   let noteHistory = {...state.noteHistory, stackId: stackId};
    //   return {...state, currentNote: currentNote, noteHistory: noteHistory};
    // }
    // case note.REDO: {
    //   let stackId = state.noteHistory.stackId > 0 ? state.noteHistory.stackId - 1 : 0;
    //   let currentNote = state.noteHistory.stack[stackId];
    //   let noteHistory = {...state.noteHistory, stackId: stackId};
    //   return {...state, currentNote: currentNote, noteHistory: noteHistory};
    // }
    case note.LOAD: {
      return {...state, loading: true};
    }
    case note.TRASH_LOAD: {
      return {...state, loading: true};
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
        selectAll: noteInitialState.selectAll,
        sortOption: noteInitialState.sortOption,
        loading: false,
        loaded: true
      });
    }
    case note.SET_LIST_PERMISSION: {
      return {...state, listPermission: action['payload']};
    }
    case note.NOTES_DELETED: {
      let noteIds: any[] = action['payload'].reduce((acc: any[], item: any) => {if(item['object_type'] == ITEM_TYPE.NOTE) acc.push(item.id); return acc;}, []);
      let folderIds: any[] = action['payload'].reduce((acc: any[], item: any) => {if(item['object_type'] == ITEM_TYPE.FOLDER) acc.push(item.id); return acc;}, []);
      let notes2: any = {...state.notes};
      noteIds.forEach((n: any) => delete notes2[n]);
      let folders2: any = {...state.folders};
      folderIds.forEach((f: any) => delete folders2[f]);

      return Object.assign({}, state, {
        notes: notes2 || {},
        folders: folders2 || {},
        selectedObjects: noteInitialState.selectedObjects,
        selectAll: noteInitialState.selectAll
      });
    }
    case note.ALL_DELETED: {
      return {
        ...state,
        notes: noteInitialState.notes,
        folders: noteInitialState.folders,
        selectedObjects: noteInitialState.selectedObjects,
        selectAll: noteInitialState.selectAll
      };
    }
    case note.CHANGE_SORT_ORDER: {
      let sortOption: any = {...state.sortOption};
      if(sortOption.field == action['payload']) {
        sortOption.desc = !sortOption.desc;
      } else {
        sortOption = {field: action['payload'], desc: noteInitialState.sortOption.desc};
      }

      return {...state, sortOption: sortOption};
    }
    case note.SELECT: {
      let selected: any = action['payload'];
      let index = state.selectedObjects.findIndex((o: any) => o.id == selected.id && o.object_type == selected.object_type);
      let newselectedObjects: any[]= [];
      let selectAll: boolean;
      if(index == -1)
        newselectedObjects = [...state.selectedObjects, selected];
      else
        newselectedObjects = state.selectedObjects.filter((o: any, idx: number) => idx !== index);
      selectAll = (Object.keys(state.notes).length + Object.keys(state.folders).length) <= newselectedObjects.length;

      return {...state, selectedObjects: newselectedObjects, selectAll: selectAll};
    }
    case note.SELECT_ONE: {
      let selected: any = action.payload;
      let selectedObjects: any[] = [...state.selectedObjects];
      let selectAll: boolean = ((Object.keys(state.notes).length + Object.keys(state.folders).length) > 1) ? noteInitialState.selectAll : true;
      // selectedObjects = ((selectedObjects.length === 1) && (selectedObjects[0].id === selected.id) && (selectedObjects[0].object_type === selected.object_type)) ? [] : [selected];
      selectedObjects = [selected];

      return {...state, selectedObjects: selectedObjects, selectAll: selectAll};
    }
    case note.DESELECT_ALL: {
      let notes: any = {};
      Object.keys(state.notes).forEach((idx: any) => {
        notes[idx] = {...state.notes[idx], selected: false};
      });

      let folders: any = {};
      Object.keys(state.folders).forEach((idx: any) => {
        folders[idx] = {...state.folders[idx], selected: false};
      });
      return {...state, selectedObjects: [], notes: notes, folders: folders, selectAll: noteInitialState.selectAll};
    }
    case note.SELECT_ALL: {
      let selectedObjects: any[] = [];
      let selectAll: boolean = false;
      let inotes: any = {};
      let folders: any = {};
      if(state.selectedObjects.length !== Object.keys(state.folders).length + Object.keys(state.notes).length) {
        Object.keys(state.notes).forEach((idx: any) => {
          selectedObjects.push({id: idx, object_type: ITEM_TYPE.NOTE});
          // inotes[idx] = {...state.notes[idx], selected: true};
        });
        Object.keys(state.folders).forEach((idx: any) => {
          selectedObjects.push({id: idx, object_type: ITEM_TYPE.FOLDER});
          // folders[idx] = {...state.folders[idx], selected: true};
        });
        selectAll = true;
      }
      return Object.assign({}, state, {selectedObjects: selectedObjects, selectAll: selectAll});
    }

    case note.MOVE_TO_FOLDER: {

      // return Object.assign({}, state, {selectedObjects: selectedObjects, selectAll: selectAll, notes: inotes, folders: folders});
      return {...state};
    }
    case note.CHANGE_VIEW_MODE: {
      return {...state, viewMode: action.payload};
    }
    case note.REMOVED_SHARE_WITH_ME: {
      let foldersDeleted = action.payload.filter((f: any) => {return f.object_type == 'folder'});
      let notesDeleted = action.payload.filter((n: any) => {return n.object_type == 'note'});
      let notes = {...state.notes};
      notesDeleted.forEach((n: any) => delete notes[n.id]);
      let folders = {...state.folders};
      foldersDeleted.forEach((f: any) => delete folders[f.id]);
      return {...state, folders: folders, notes: notes};
    }
    default: {
      return state;
    }
  }
}

export const getNotes = (state: State ) => state.notes;
export const getPageNo = (state: State ) => state.pageNo;
export const getOrderDesc = (state: State ) => state.orderDesc;
export const getSortOption = (state: State ) => state.sortOption;
export const getFolders = (state: State ) => state.folders;
export const getSelectAll = (state: State ) => state.selectAll;
export const getSelectedObjects = (state: State ) => state.selectedObjects;
export const getViewMode = (state: State ) => state.viewMode;
export const getCurrentNote = (state: State ) => state.currentNote;
export const getLoading = (state: State ) => state.loading;
export const getLoaded = (state: State ) => state.loaded;


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

export const getSortedNotes = createSelector(getNotes, getSortOption, (notes, sortOption) => {
  // Convert original HASH notes to an sorted ARRAY notes
  let cloneNotes: any[] = [];
  Object.keys(notes).forEach((idx: any) => cloneNotes.push(notes[idx]));
  let sortField = ['name', 'title'].includes(sortOption.field) ? 'title' : sortOption.field;
  if(!sortOption.field)
    return cloneNotes;
  return cloneNotes.sort((a: Note, b: Note) => compareBy(a, b, sortOption.desc, sortField));
});

export const getSortedFolders = createSelector(getFolders, getSortOption, (folders, sortOption) => {
  // Convert original HASH folders to an sorted ARRAY folders
  let cloneFolders: any[] = [];
  let sortField = ['name', 'title'].includes(sortOption.field) ? 'name' : sortOption.field;
  Object.keys(folders).forEach((idx: any) => cloneFolders.push(folders[idx]));
  if(!sortOption.field)
    return cloneFolders;
  return cloneFolders.sort((a: Folder, b: Folder) => compareBy(a, b, sortOption.desc, sortField));
});

export function compareBy(objA: any, objB: any, orderDesc: boolean, field: string = 'title'): number {
  let o = orderDesc ? 1 : -1;
  if(objA[field] > objB[field])
    return 1*o;
  if(objA[field] < objB[field])
    return -1*o;

  return 0;
}
