import { Component, OnInit, ViewChild } from '@angular/core';
import { ZNoteService } from '../shared/services/note.service';
// import { ApiBaseService } from '@shared/shared/services/apibase.service';
import { CommonEventService } from '@shared/shared/services/common-event/common-event.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
import * as folder from '../shared/actions/folder';
import { Observable } from 'rxjs/Observable';
import { Folder } from '../shared/reducers/folder';
import { Note } from '@shared/shared/models/note.model';
import { AppStore } from '../shared/app-store';
import { MixedEntityAction } from '../shared/mixed-enity/mixed-entity.action';
import { UserService } from '@shared/shared/services/user.service';

declare var _: any;

@Component({
  selector: 'z-note-my-note',
  templateUrl: 'my-note.component.html'
})
export class ZNoteMyNoteComponent implements OnInit {
  @ViewChild('introModal') introModal: any;

  viewOption: string = 'grid';
  noteItems$: Observable<Note[]>;
  folderItems$: Observable<Folder[]>;
  sortOption$: Observable<any>;
  nodeState$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;
  loading$: Observable<boolean>;
  items: Observable<any>;

  constructor(private noteService: ZNoteService,
     private commonEventService: CommonEventService,
     private userService: UserService,
     private store: Store<fromRoot.State>) {
    this.noteItems$ = this.store.select(fromRoot.getSortedNotes);
    this.folderItems$ = this.store.select(fromRoot.getSortedFolders);
    this.sortOption$ = this.store.select(fromRoot.getSortOption);
    this.nodeState$ = this.store.select(fromRoot.getNotesState);
    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.loading$ = this.store.select(fromRoot.getLoading);
  }

  ngOnInit() {
    // this.store.dispatch(new note.Load({parent_id: null}));
    this.store.dispatch({type: note.LOAD, payload: {parent_id: null}});

    this.store.dispatch({type: folder.UPDATE_CURRENT, payload: {parent_id: null}});

    if(!_.get(this.userService.profile, 'introduction.note')) this.introModal.open();
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_add_modal'});
  }

  onFolder() {
    this.noteService.modalEvent({
      action: 'note:folder:create'
    });
  }
}
