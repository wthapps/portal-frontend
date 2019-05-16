import * as note from '../actions/note';
import { Note } from '@shared/shared/models/note.model';
import { Folder } from './folder';

// Constants
export const ITEM_TYPE = {
  NOTE: 'Note::Note',
  FOLDER: 'Note::Folder'
};
export const VIEW_MODE = {
  LIST: 'list',
  GRID: 'grid',
  TIMELINE: 'time'
};
export const GROUP_TYPE = {
  date: 'date',
  month: 'month',
  year: 'year'
};

// State
export interface State {
  notes: { [id: number]: Note };
  currentNote: Note | null;
  folders: { [id: number]: Folder }; // {1 :{id: 1, name: "abc"}, 2 :{id: 2, name: "sdfsdf"}  }
  group: string;
  selectedObjects: { id: string, object_type: string, parent_id: number }[];
  selectAll: boolean;
}

export const noteInitialState: State = {
  notes: {},
  currentNote: null,
  folders: {},
  group: GROUP_TYPE.date,
  selectedObjects: [],
  selectAll: false
};

// Reducer
export function reducer(
  state: State = noteInitialState,
  action: note.NoteActions
): State {
  switch (action.type) {
    case note.NOTE_ADDED: {
      const hNote: any = {};
      hNote[action['payload']['id']] = action['payload'];
      const notes = { ...state.notes, hNote };
      return { ...state, notes: notes, currentNote: action['payload'] };
    }
    case note.MULTI_NOTES_ADDED: {
      const hNotes: any = action['payload'].reduce((acc: any, item: any) => {
        if (item.object_type === ITEM_TYPE.NOTE) {
          acc[item.id] = item;
        }
        return acc;
      }, {});
      const hFolders: any = action['payload'].reduce((acc: any, item: any) => {
        if (item.object_type === ITEM_TYPE.FOLDER) {
          acc[item.id] = item;
        }
        return acc;
      }, {});

      const notes: any = { ...state.notes, ...hNotes };
      const folders: any = { ...state.folders, ...hFolders };

      return Object.assign({}, state, { notes: notes, folders: folders });
    }
    case note.MULTI_NOTES_UPDATED: {
      const notes: any = { ...state.notes };
      const folders: any = { ...state.folders };
      action.payload.forEach((item: any) => {
        if (item.object_type === 'Note::Note') {
          notes[item.id] = { ...notes[item.id], ...item };
        } else if (item.object_type === 'Note::Folder') {
          folders[item.id] = { ...folders[item.id], ...item };
        }
      });

      // update selected objects
      let items = [];
      for (const item of action['payload']) {
        for (const object of state.selectedObjects) {
          if (object.id === item.id) {
            items.push(item);
          }
        }
      }
      for (const object of state.selectedObjects) {
        items.push(object);
      }
      items = _.uniqBy(items, 'id');
      return {
        ...state,
        notes: notes,
        folders: folders,
        selectedObjects: items
      };
    }
    case note.SET_FOLDERS: {
      const hFolders: any = action['payload'].reduce((acc: any, item: any) => {
        if (item.object_type === ITEM_TYPE.FOLDER) {
          acc[item.id] = item;
        }
        return acc;
      }, {});

      return Object.assign({}, state, {
        folders: { ...state.folders, ...hFolders }
      });
    }
    case note.NOTE_UPDATED: {
      const existed: boolean = state.notes[action.payload.id] !== undefined;
      const hNote: any = {};

      hNote[action.payload.id] = {
        ...state.notes[action.payload.id],
        ...action.payload
      };
      const notes4: any = existed
        ? { ...state.notes, ...hNote }
        : { ...state.notes };

      return Object.assign({}, state, { notes: notes4 });
    }
    case note.EDIT: {
      const idx: any = action['payload']['id'];
      const currentNote = idx ? state.notes[idx] : new Note();
      return {
        ...state,
        currentNote: currentNote
      };
    }
    case note.RESET_CURRENT_NOTE: {
      return {
        ...state,
        currentNote: new Note()
      };
    }
    case note.LOAD_SUCCESS: {
      const [hNotes, hFolders, hSelected] = [{}, {}, []];

      action['payload'].forEach(item => {
        if (item.object_type === ITEM_TYPE.NOTE) {
          hNotes[item.id] = item;
        }
        if (item.object_type === ITEM_TYPE.FOLDER) {
          hFolders[item.id] = item;
        }
      });

      state.selectedObjects.forEach(obj => {
        if (obj.object_type === ITEM_TYPE.NOTE && hNotes[obj.id]) {
          hSelected.push(obj);
        }
        if (obj.object_type === ITEM_TYPE.FOLDER && hFolders[obj.id]) {
          hSelected.push(obj);
        }
      });

      return Object.assign({}, state, {
        notes: hNotes,
        folders: hFolders,
        selectedObjects: hSelected,
        selectAll: noteInitialState.selectAll,
        loading: false,
        loaded: true
      });
    }
    case note.NOTES_DELETED: {
      const noteIds: any[] = action['payload'].reduce(
        (acc: any[], item: any) => {
          if (item['object_type'] === ITEM_TYPE.NOTE) {
            acc.push(item.id);
          }
          return acc;
        },
        []
      );
      const folderIds: any[] = action['payload'].reduce(
        (acc: any[], item: any) => {
          if (item['object_type'] === ITEM_TYPE.FOLDER) {
            acc.push(item.id);
          }
          return acc;
        },
        []
      );
      const notes2: any = { ...state.notes };
      noteIds.forEach((n: any) => delete notes2[n]);
      const folders2: any = { ...state.folders };
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
    case note.SELECT: {
      const selected: any = action['payload'];
      const index = state.selectedObjects.findIndex(
        (o: any) =>
          o.id === selected.id && o.object_type === selected.object_type
      );
      let newselectedObjects: any[] = [];
      let selectAll: boolean;
      if (index === -1) {
        newselectedObjects = [...state.selectedObjects, selected];
      } else {
        newselectedObjects = state.selectedObjects.filter(
          (o: any, idx: number) => idx !== index
        );
      }
      selectAll =
        Object.keys(state.notes).length + Object.keys(state.folders).length <=
        newselectedObjects.length;

      return {
        ...state,
        selectedObjects: newselectedObjects,
        selectAll: selectAll
      };
    }
    case note.SELECT_ONE: {
      const selected: any = action.payload;
      let selectedObjects: any[] = [...state.selectedObjects];
      const selectAll: boolean =
        Object.keys(state.notes).length + Object.keys(state.folders).length > 1
          ? noteInitialState.selectAll
          : true;
      selectedObjects = [selected];

      return {
        ...state,
        selectedObjects: selectedObjects,
        selectAll: selectAll
      };
    }
    case note.DESELECT_ALL: {
      const notes: any = {};
      Object.keys(state.notes).forEach((idx: any) => {
        notes[idx] = { ...state.notes[idx], selected: false };
      });

      const folders: any = {};
      Object.keys(state.folders).forEach((idx: any) => {
        folders[idx] = { ...state.folders[idx], selected: false };
      });
      return {
        ...state,
        selectedObjects: [],
        notes: notes,
        folders: folders,
        selectAll: noteInitialState.selectAll
      };
    }
    case note.SELECT_ALL: {
      const selectedObjects: any[] = [];
      let selectAll = false;
      if (
        state.selectedObjects.length !==
        Object.keys(state.folders).length + Object.keys(state.notes).length
      ) {
        Object.keys(state.notes).forEach((idx: any) => {
          selectedObjects.push(state.notes[idx]);
        });
        Object.keys(state.folders).forEach((idx: any) => {
          selectedObjects.push(state.folders[idx]);
        });
        selectAll = true;
      }
      return Object.assign({}, state, {
        selectedObjects: selectedObjects,
        selectAll: selectAll
      });
    }

    case note.MOVE_TO_FOLDER: {
      return { ...state };
    }
    case note.REMOVED_SHARE_WITH_ME: {
      const foldersDeleted = action.payload.filter((f: any) => {
        return f.object_type === 'Note::Folder';
      });
      const notesDeleted = action.payload.filter((n: any) => {
        return n.object_type === 'Note::Note';
      });
      const notes = { ...state.notes };
      notesDeleted.forEach((n: any) => delete notes[n.id]);
      const folders = { ...state.folders };
      foldersDeleted.forEach((f: any) => delete folders[f.id]);
      return { ...state, folders: folders, notes: notes };
    }
    default: {
      return state;
    }
  }
}

export const getNotes = (state: State) => state.notes;
export const getFolders = (state: State) => state.folders;
export const getSelectAll = (state: State) => state.selectAll;
export const getSelectedObjects = (state: State) => state.selectedObjects;
export const getCurrentNote = (state: State) => state.currentNote;
