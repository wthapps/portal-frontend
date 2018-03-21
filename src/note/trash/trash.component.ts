import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ZNoteService } from '../shared/services/note.service';
import * as fromRoot from '../shared/reducers/index';
import * as context from '../shared/reducers/context';
import * as note from '../shared/actions/note';
import { Note } from '@shared/shared/models/note.model';
import { Constants } from '@shared/constant/config/constants';
import * as listReducer from '../shared/reducers/features/list-mixed-entities';
import { noteConstants } from 'note/shared/config/constants';

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
  loading$: Observable<any>;

  readonly PAGE_TYPE: any = Constants.notePageType;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private noteService: ZNoteService
  ) {}

  ngOnInit() {
    this.noteItems$ = this.store.select(listReducer.getNotes);
    this.folderItems$ = this.store.select(listReducer.getFolders);
    this.sortOption$ = this.store.select(fromRoot.getSortOption);
    this.nodeState$ = this.store.select(fromRoot.getNotesState);
    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
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
