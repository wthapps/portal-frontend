import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ZNoteService } from '../shared/services/note.service';
import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
import { Note } from '../../core/shared/models/note.model';
@Component({
  moduleId: module.id,
  selector: 'z-note-shared-with-me',
  templateUrl: 'shared-with-me.component.html'
})
export class ZNoteSharedWithMeComponent implements OnInit {
  viewOption: string = 'list';

  noteItems$: Observable<Note[]>;
  folderItems$: Observable<any>;
  sortOption$: Observable<boolean>;
  nodeState$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromRoot.State>,
              private noteService: ZNoteService) {
  }

  ngOnInit() {
    this.noteItems$ = this.store.select(fromRoot.getSortedNotes);
    this.folderItems$ = this.store.select(fromRoot.getSortedFolders);
    this.sortOption$ = this.store.select(fromRoot.getSortOption);
    this.nodeState$ = this.store.select(fromRoot.getNotesState);
    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.store.dispatch(new note.Load({parent_id: null, shared_with_me: true}));
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_edit_modal'});
  }
}
