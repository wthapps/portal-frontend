import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as note from '../shared/actions/note';

import * as context from '../shared/reducers/context';
import { noteConstants, NoteConstants } from "note/shared/config/constants";

@Component({
  selector: 'z-note-favourite',
  templateUrl: 'favourite.component.html'
})
export class ZNoteFavouriteComponent implements OnInit {
  noteConstants: NoteConstants = noteConstants;

  constructor(private store: Store<any>) {}
  ngOnInit() {
    this.store.dispatch({type: note.LOAD, payload: {parent_id: null, favourite: true}});
    this.store.dispatch({type: context.SET_CONTEXT, payload: {
      page: this.noteConstants.PAGE_NOTE_FAVOURITE,
      pathTitle: 'Favourite',
      permissions: this.noteConstants.PAGE_PERMISSIONS.FAVOURITE,
      noData: this.noteConstants.NO_DATA.FAVOURITE,
    }});
  }
}
