import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { ZNoteService } from '../shared/services/note.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
import * as folder from '../shared/actions/folder';
import { Observable } from 'rxjs/Observable';
import { Folder } from '../shared/reducers/folder';
import { Note } from '../../core/shared/models/note.model';
import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-folders',
  templateUrl: 'folders.component.html'
})
export class ZNoteFoldersComponent implements OnInit, OnDestroy {
  viewOption: string = 'grid';
  noteItems$: Observable<Note[]>;
  folderItems$: Observable<Folder[]>;
  sortOption$: Observable<any>;
  nodeState$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  currentFolderPath$: Observable<any[]>;
  loading$: Observable<boolean>;
  currentFolder: any;

  items: Observable<any>;

  sub: Subscription;
  sub2: Subscription;

  constructor(private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private commonEventService: CommonEventService) {
    this.noteItems$ = this.store.select(fromRoot.getSortedNotes);
    this.folderItems$ = this.store.select(fromRoot.getSortedFolders);
    this.sortOption$ = this.store.select(fromRoot.getSortOption);
    this.nodeState$ = this.store.select(fromRoot.getNotesState);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.currentFolderPath$ = this.store.select(fromRoot.getCurrentFolderPath);
    this.loading$ = this.store.select(fromRoot.getLoading);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      console.log(+params['id']);
      let id = +params['id'];

      // this.store.dispatch(new note.Load({parent_id: id}));
      // this.store.dispatch(new folder.SetCurrentFolder(id));
      this.store.dispatch({type: note.LOAD, payload: {parent_id: id}});
      this.store.dispatch({type: folder.SET_CURRENT, payload: id});

      if (this.sub2 && !this.sub.closed) {
        this.sub2.unsubscribe();
      }

      this.sub2 = this.store.select(fromRoot.getCurrentFolder).subscribe(
        (res: any)=> {
          console.log('this.sub2:', res);
          if (res && res.id == id) {
            this.commonEventService.broadcast({
              channel: 'noteFolderEvent',
              action: 'updateFoldersTree',
              payload: res
            });
          }

        }
      );

    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  onNewNote() {
    this.noteService.modalEvent({
      action: 'note:open_note_add_modal',
      payload: {parent_id: +this.route.snapshot.params['id']}
    });
  }
}
