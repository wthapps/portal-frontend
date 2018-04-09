import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

import { ZNoteService } from '../shared/services/note.service';
import * as note from '../shared/actions/note';
import * as context from '../shared/reducers/context';
import { noteConstants, NoteConstants } from '@notes/shared/config/constants';

@Component({
  selector: 'z-note-shared-with-me',
  templateUrl: 'shared-with-me.component.html'
})
export class ZNoteSharedWithMeComponent implements OnInit {
  noteConstants: NoteConstants = noteConstants;

  constructor(
    private store: Store<any>,
    private noteService: ZNoteService,
    private route: ActivatedRoute
  ) {
    //  Open up node edit modal for query params
    route.queryParamMap.subscribe((paramMap: any) => {
      if (paramMap.get('notes')) {
        this.noteService
          .get(paramMap.get('notes'))
          .toPromise()
          .then((res: any) => {
            this.noteService.modalEvent({
              action: 'note:open_note_view_modal',
              payload: res.data
            });
          });
      }
    });
  }

  ngOnInit() {
    this.store.dispatch({
      type: note.LOAD,
      payload: { parent_id: null, shared_with_me: true }
    });
    this.store.dispatch({
      type: context.SET_CONTEXT,
      payload: {
        page: this.noteConstants.PAGE_SHARED_WITH_ME,
        pathTitle: 'Shared with me',
        permissions: this.noteConstants.PAGE_PERMISSIONS.SHARED_WITH_ME,
        noData: this.noteConstants.NO_DATA.SHARED_WITH_ME
      }
    });
  }
}
