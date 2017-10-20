import { Component, OnInit } from '@angular/core';
import { ZNoteService } from '../shared/services/note.service';
// import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
import * as folder from '../shared/actions/folder';
import { Observable } from 'rxjs/Observable';
import { Folder } from '../shared/reducers/folder';
import { Note } from '../../core/shared/models/note.model';
import { AppStore } from '../shared/app-store';
import { MixedEntityAction } from '../shared/mixed-enity/mixed-entity.action';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-my-note',
  templateUrl: 'my-note.component.html'
})
export class ZNoteMyNoteComponent implements OnInit {
  // data: Array<any> = new Array<any>();
  viewOption: string = 'grid';
  noteItems$: Observable<Note[]>;
  folderItems$: Observable<Folder[]>;
  sortOption$: Observable<any>;
  nodeState$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;
  loading$: Observable<boolean>;
  items: Observable<any>;

  constructor(private noteService: ZNoteService, private commonEventService: CommonEventService, private store: Store<fromRoot.State>) {
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
    this.commonEventService.filter((event: any) => event.channel == 'noteFolderEvent' && event.action == 'updateFolders').subscribe((event: any) => {
      this.store.dispatch({type: note.SET_FOLDERS, payload: event.payload});
    });
    this.store.dispatch({type: folder.UPDATE_CURRENT, payload: {parent_id: null}});
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
