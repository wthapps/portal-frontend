import { Component, OnInit, ViewChild } from '@angular/core';
import { ZNoteService } from '../shared/services/note.service';
// import { ApiBaseService } from '@shared/shared/services/apibase.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../shared/reducers/index';
import * as listReducer from '../shared/reducers/features/list-mixed-entities';
import * as context from '../shared/reducers/context';
import * as note from '../shared/actions/note';
import * as folder from '../shared/actions/folder';
import { Observable } from 'rxjs/Observable';
import { Folder } from '../shared/reducers/folder';
import { Note } from '@shared/shared/models/note.model';
import { AppStore } from '../shared/app-store';
import { MixedEntityAction } from '../shared/mixed-enity/mixed-entity.action';
import { UserService } from '@shared/services/user.service';
import { noteConstants, NoteConstants } from "note/shared/config/constants";

declare var _: any;

@Component({
  selector: 'z-note-my-note',
  templateUrl: 'my-note.component.html'
})
export class ZNoteMyNoteComponent implements OnInit {
  noteConstants: NoteConstants = noteConstants;

  constructor(private store: Store<any>) {}
  ngOnInit() {
    this.store.dispatch({type: note.LOAD, payload: {parent_id: null}});
    this.store.dispatch({type: context.SET_CONTEXT, payload: {
      page: this.noteConstants.PAGE_MY_NOTE,
      pathTitle: 'My notes',
      permissions: this.noteConstants.PAGE_PERMISSIONS.MY_NOTE,
      noData: this.noteConstants.NO_DATA.MY_NOTE
    }});
  }
}
