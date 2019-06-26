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
}

export const noteInitialState: State = {
  notes: {},
  currentNote: null,
  folders: {},
  group: GROUP_TYPE.date
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
      const notes = { ...state.notes, ...hNote };
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

      return {
        ...state,
        notes: notes,
        folders: folders
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
      const [hNotes, hFolders] = [{}, {}];

      action['payload'].forEach(item => {
        if (item.object_type === ITEM_TYPE.NOTE) {
          hNotes[item.id] = item;
        }
        if (item.object_type === ITEM_TYPE.FOLDER) {
          hFolders[item.id] = item;
        }
      });

      return Object.assign({}, state, {
        notes: hNotes,
        folders: hFolders,
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
        folders: folders2 || {}
      });
    }
    case note.ALL_DELETED: {
      return {
        ...state,
        notes: noteInitialState.notes,
        folders: noteInitialState.folders
      };
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
export const getCurrentNote = (state: State) => state.currentNote;
