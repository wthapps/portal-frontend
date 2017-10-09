import { Component, OnInit } from '@angular/core';
import { ZNoteService } from '../shared/services/note.service';
// import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
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
  orderDesc$: Observable<boolean>;
  nodeState$: Observable<any>;
  public selectedObjects$: Observable<any[]>;

  items: Observable<any>;
  selectedObjects: Observable<Array<any>>;
  selectingObjects: Observable<Array<any>>;

  constructor(private noteService: ZNoteService, private commonEventService: CommonEventService, private store: Store<fromRoot.State>) {
    this.items = this.store.select('mixedEntity').do((store: any) => {
      console.log('tesing::::', store);
    });


    // this.noteItems$ = this.store.select(fromRoot.getSortedNotes);

    this.folderItems$ = this.store.select(fromRoot.getSortedFolders);
    this.orderDesc$ = this.store.select(fromRoot.getOrderDesc);
    this.nodeState$ = this.store.select(fromRoot.getNotesState);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
  }

  ngOnInit() {
    this.store.dispatch(MixedEntityAction.getAll({parent_id: null}));
    // this.store.dispatch(new note.Load({parent_id: null}));
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_add_modal'});
  }
}
