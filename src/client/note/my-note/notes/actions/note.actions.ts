import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class NoteActions {
  static NOTE_NOTE_CREATE = 'NOTE_NOTE_CREATE';
  create(note): Action {
    return {
      type: NoteActions.NOTE_NOTE_CREATE,
      payload: note
    };
  }

  static NOTE_NOTE_UPDATE = 'NOTE_NOTE_UPDATE';
  update(note): Action {
    return {
      type: NoteActions.NOTE_NOTE_UPDATE,
      payload: note
    };
  }

  static NOTE_NOTE_DELETE = 'NOTE_NOTE_DELETE';
  delete(note): Action {
    return {
      type: NoteActions.NOTE_NOTE_DELETE,
      payload: note
    };
  }

}
