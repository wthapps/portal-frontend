import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { ZNoteService } from '../shared/services/note.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
import * as folder from '../shared/actions/folder';
import { Observable } from 'rxjs/Observable';
import { Folder } from '../shared/reducers/folder';
import { Note } from '../../core/shared/models/note.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-folders',
  templateUrl: 'folders.component.html'
})
export class ZNoteFoldersComponent implements OnInit {
  viewOption: string = 'grid';
  noteItems$: Observable<Note[]>;
  folderItems$: Observable<Folder[]>;
  orderDesc$: Observable<boolean>;
  nodeState$: Observable<any>;
  selectedObjects$: Observable<any[]>;
  currentFolderPath$: Observable<any[]>;

  items: Observable<any>;

  constructor(private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private route: ActivatedRoute) {
    this.noteItems$ = this.store.select(fromRoot.getSortedNotes);
    this.folderItems$ = this.store.select(fromRoot.getSortedFolders);
    this.orderDesc$ = this.store.select(fromRoot.getOrderDesc);
    this.nodeState$ = this.store.select(fromRoot.getNotesState);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.currentFolderPath$ = this.store.select(fromRoot.getCurrentFolderPath);
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.store.dispatch(new note.Load({parent_id: +params['id']}));
      this.store.dispatch(new folder.SetCurrentFolder(+params['id']));
    });
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_add_modal', payload: { parent_id: +this.route.snapshot.params['id']}});
  }
}
