import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ZNoteService } from '../shared/services/note.service';
import * as fromRoot from '../shared/reducers/index';
import * as fromNote from '../shared/actions/note';
import * as listReducer from '../shared/reducers/features/list-mixed-entities';

import { Note } from '@shared/shared/models/note.model';
import { Folder } from '../shared/reducers/folder';
import { CommonEventService } from "@shared/services";
import * as context from '../shared/reducers/context';
import { noteConstants, NoteConstants } from "note/shared/config/constants";

@Component({
  selector: 'z-note-my-sharing',
  templateUrl: 'my-sharing.component.html'
})
export class ZNoteMySharingComponent implements OnInit, OnDestroy {

  public noteItems$: Observable<Note[]>;
  public folderItems$: Observable<Folder[]>;
  sortOption$: Observable<any>;
  nodeState$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  selectAll$: Observable<boolean>;
  currentFolderPath$: Observable<any[]>;
  viewMode$: Observable<any>;
  loading$: Observable<boolean>;
  isSelectAll$: Observable<boolean>;
  context$: Observable<any>;
  sub: any;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private commonEventService: CommonEventService,
              private store: Store<fromRoot.State>,
              private noteService: ZNoteService
  ) {

    this.noteItems$ = this.store.select(listReducer.getNotes);
    this.folderItems$ = this.store.select(listReducer.getFolders);
    this.sortOption$ = this.store.select(fromRoot.getSortOption);
    this.viewMode$ = this.store.select(fromRoot.getViewMode);
    this.nodeState$ = this.store.select(fromRoot.getNotesState);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.currentFolderPath$ = this.store.select(fromRoot.getCurrentFolderPath);
    this.selectAll$ = this.store.select(fromRoot.getSelectAll);
    this.loading$ = this.store.select(fromRoot.getLoading);
    this.context$ = this.store.select(context.getContext);

    this.route.params
      .takeUntil(this.destroySubject)
      .switchMap((params: any) => this.noteService.getAll())
      .subscribe((res: any) => {
        this.sub = this.route.params.subscribe((params: any) => {
          this.store.dispatch(new fromNote.Load({parent_id: null, shared_by_me: true}));
        });
    });
    this.commonEventService.filter((event: any) => event.action == 'note:mixed_entity:move_to_folder_done' && event.channel == 'noteActionsBar')
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.store.dispatch(new fromNote.Load({parent_id: null, shared_by_me: true}));
      });
  }

  ngOnInit() {
    this.store.dispatch({type: context.SET_CONTEXT, payload: { page: noteConstants.PAGE_SHARED_BY_ME}});
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
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
