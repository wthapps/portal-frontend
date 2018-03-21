import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ZNoteService } from '../shared/services/note.service';
import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
import * as listReducer from '../shared/reducers/features/list-mixed-entities';

import { Note } from '@shared/shared/models/note.model';
import { Folder } from '../shared/reducers/folder';
import { CommonEventService } from '@shared/services';
import * as context from '../shared/reducers/context';
import { noteConstants, NoteConstants } from 'note/shared/config/constants';

@Component({
  selector: 'z-note-shared-by-me',
  templateUrl: 'shared-by-me.component.html'
})
export class ZNoteSharedByMeComponent implements OnInit {
  noteConstants: NoteConstants = noteConstants;

  constructor(private store: Store<any>) {}
  ngOnInit() {
    this.store.dispatch({
      type: note.LOAD,
      payload: { parent_id: null, shared_by_me: true }
    });
    this.store.dispatch({
      type: context.SET_CONTEXT,
      payload: {
        page: this.noteConstants.PAGE_SHARED_BY_ME,
        pathTitle: 'Shared by me',
        permissions: this.noteConstants.PAGE_PERMISSIONS.SHARED_BY_ME,
        noData: this.noteConstants.NO_DATA.SHARED_BY_ME
      }
    });
  }
}
