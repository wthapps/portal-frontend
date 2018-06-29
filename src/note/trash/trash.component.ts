import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ZNoteService } from '../shared/services/note.service';
import * as fromRoot from '../shared/reducers/index';
import * as context from '../shared/reducers/context';
import * as note from '../shared/actions/note';
import { Note } from '@shared/shared/models/note.model';
import * as listReducer from '../shared/reducers/features/list-mixed-entities';
import { noteConstants } from '@notes/shared/config/constants';

@Component({
  selector: 'z-note-trash',
  templateUrl: 'trash.component.html'
})
export class ZNoteTrashComponent implements OnInit {
  viewOption: string = 'list';

  noteItems$: Observable<Note[]>;
  folderItems$: Observable<any>;
  sortOption$: Observable<any>;
  nodeState$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;
  allItems$: Observable<any[]>;
  context$: Observable<any>;
  currentFolder$: Observable<any>;
  loading$: Observable<any>;

  readonly PAGE_TYPE: any = noteConstants.PAGE_TRASH;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private noteService: ZNoteService
  ) {}

  ngOnInit() {
    this.noteItems$ = this.store.select(listReducer.getNotes);
    this.folderItems$ = this.store.select(listReducer.getFolders);
    this.allItems$ = this.store.select(listReducer.getAllItems);
    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.context$ = this.store.select(context.getContext);
    this.currentFolder$ = this.store.select(fromRoot.getCurrentFolder);
    this.loading$ = this.store.select(fromRoot.getLoading);

    this.store.dispatch({
      type: context.SET_CONTEXT,
      payload: {
        page: noteConstants.PAGE_TRASH
      }
    });
    this.store.dispatch({ type: note.TRASH_LOAD });
  }

  onNewNote() {
    this.noteService.modalEvent({
      action: 'note:open_note_add_modal',
      payload: { parent_id: null }
    });
  }

  onFolder() {
    this.noteService.modalEvent({
      action: 'note:folder:create',
      payload: { parent_id: null }
    });
  }
}
