import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as note from '../shared/actions/note';

import * as context from '../shared/reducers/context';
import { noteConstants, NoteConstants } from '@notes/shared/config/constants';

@Component({
  selector: 'z-note-recent',
  templateUrl: 'recent.component.html'
})
export class ZNoteRecentComponent implements OnInit, OnDestroy {
  noteConstants: NoteConstants = noteConstants;

  constructor(private store: Store<any>) {}
  ngOnInit() {
    this.store.dispatch({
      type: note.LOAD,
      payload: { parent_id: null, recent: true }
    });
    this.store.dispatch({
      type: context.SET_CONTEXT,
      payload: {
        page: this.noteConstants.PAGE_RECENT,
        pathTitle: 'Recent',
        permissions: this.noteConstants.PAGE_PERMISSIONS.RECENT,
        noData: this.noteConstants.NO_DATA.RECENT,
        viewMode: 'list',
        sort: {
          field: 'accessed_date',
          desc: false
        }
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch({
      type: context.SET_CONTEXT,
      payload: {
        sort: {
          field: 'name',
          desc: false
        }
      }
    });
  }
}
