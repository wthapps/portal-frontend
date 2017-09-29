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

declare var _: any;

// Constants
export const PAGE_SIZE = 10;

// State
export interface Note {
  id: string;
  uuid: string;
  title: string;
  owner: User;
  content: string
}
export interface  Filters {
  folder: string };
// export type State = { notes: {[id: number]: Note}, page: number, orderDesc: boolean, filters: Filters };
export interface State {
  notes: Note[] | null;
  page: number;
  orderDesc: boolean;
  selectedIds: number[]
  // ; filters: Filters
};

export const noteInitialState: State = {
  notes: [],
  page: 0,
  orderDesc: true,
  selectedIds: []
  // filters: { folder: ''}
};


// Reducer
export function reducer(state: State = noteInitialState, action: note.NoteActions): any {
  switch (action.type) {
    case note.NOTES_ADDED: {
      const notes = [...state.notes, ...action['payload']];
      return Object.assign({}, state, {notes: notes});
    }
    case note.LOAD_SUCCESS:
      return Object.assign({}, state, {notes: action['payload']});
    case note.NOTES_REMOVED:
      const ids = action['payload'];
      const notes = state.notes.filter((n: any) => ids.indexOf(n.id) > -1)
      return Object.assign({}, state, {notes: notes});
    case note.CHANGE_SORT_ORDER:
      const rOrderDesc = !state.orderDesc;
      return Object.assign({}, state, { orderDesc: rOrderDesc});
    case note.SELECT:
      const id = action['payload'];
      return state;
    default: {
      return state;
    }
  }
}

export const getNotes = (state: State ) => state.notes;
export const getPage = (state: State ) => state.page;
export const getOrderDesc = (state: State ) => state.orderDesc;
export const getSortedNotes = createSelector(getNotes, getOrderDesc, (notes: Note[], orderDesc: boolean) => {
  const cloneNotes = [...notes];
  return cloneNotes.sort((a: Note, b: Note) => {
   return (((a.title >= b.title) && orderDesc) ? 1 : -1) ;
  });
})
