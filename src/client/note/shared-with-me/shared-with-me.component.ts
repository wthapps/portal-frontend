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
export class ZNoteSharedWithMeComponent implements OnInit, OnDestroy {
  viewOption: string = 'list';

  noteItems$: Observable<Note[]>;
  folderItems$: Observable<any>;
  sortOption$: Observable<any>;
  nodeState$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;
  loading$: Observable<any>;
  sub: any;

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
    this.loading$ = this.store.select(fromRoot.getLoading);
    this.sub = this.route.params.subscribe((params: any) => {
      if(params['id']) {
        this.store.dispatch(new note.Load({parent_id: params['id'], shared_with_me: true}));
      } else {
        this.store.dispatch(new note.Load({parent_id: null, shared_with_me: true}));
      }
    });

  }

  ngOnDestroy() {
    if(this.sub) this.sub.unsubscribe();
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_edit_modal'});
  }
}
