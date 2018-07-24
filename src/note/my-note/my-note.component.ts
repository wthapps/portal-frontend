import { Component, OnInit, ViewChild } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Store } from '@ngrx/store';

import * as context from '../shared/reducers/context';
import * as note from '../shared/actions/note';
import { noteConstants, NoteConstants } from '@notes/shared/config/constants';

declare var _: any;

@Component({
  selector: 'z-note-my-note',
  templateUrl: 'my-note.component.html'
})
export class ZNoteMyNoteComponent implements OnInit {
  noteConstants: NoteConstants = noteConstants;
  @ViewChild('modal') modal: BsModalComponent;

  constructor(
    private store: Store<any>
  ) {}
  ngOnInit() {
    this.store.dispatch({ type: note.LOAD, payload: { parent_id: null } });
    this.store.dispatch({
      type: context.SET_CONTEXT,
      payload: {
        page: this.noteConstants.PAGE_MY_NOTE,
        pathTitle: 'My notes',
        permissions: this.noteConstants.PAGE_PERMISSIONS.MY_NOTE,
        noData: this.noteConstants.NO_DATA.MY_NOTE
      }
    });
  }
}
