import { Injectable } from '@angular/core';

@Injectable()
export class NoteActions {
  static NOTE_NOTE_CREATE = 'NOTE_NOTE_CREATE';
  create(note: any): any {
    return {
      type: NoteActions.NOTE_NOTE_CREATE,
      payload: note
    };
  }

  static NOTE_NOTE_UPDATE = 'NOTE_NOTE_UPDATE';
  update(note: any): any {
    return {
      type: NoteActions.NOTE_NOTE_UPDATE,
      payload: note
    };
  }

  static NOTE_NOTE_DELETE = 'NOTE_NOTE_DELETE';
  delete(note: any): any {
    return {
      type: NoteActions.NOTE_NOTE_DELETE,
      payload: note
    };
  }

}
