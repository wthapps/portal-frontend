import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ZNoteService } from '../services/note.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../reducers/index';
import * as listReducer from '../reducers/features/list-mixed-entities';
import * as context from '../reducers/context';
import { Observable } from 'rxjs/Observable';
import { Folder } from '../reducers/folder';
import { UserService } from '@shared/services/user.service';
import { noteConstants, NoteConstants } from "../config/constants";
import { Note } from "@shared/shared/models/note.model";

declare var _: any;

@Component({
  selector: 'z-note-container',
  templateUrl: 'note-container.component.html'
})
export class ZNoteContainerComponent implements OnInit {
  @ViewChild('introModal') introModal: any;
  @Input() breadcrumbs: any;

  viewOption: string = 'grid';
  noteItems$: Observable<Note[]>;
  folderItems$: Observable<Folder[]>;
  selectedObjects$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;
  loading$: Observable<boolean>;
  items: Observable<any>;
  context$: Observable<any>;
  currentFolder$: Observable<any>;
  noteConstants: NoteConstants = noteConstants;

  constructor(private noteService: ZNoteService,
     private userService: UserService,
     private store: Store<any>) {
    this.noteItems$ = this.store.select(listReducer.getNotes);
    this.folderItems$ = this.store.select(listReducer.getFolders);
    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.context$ = this.store.select(context.getContext);
    this.currentFolder$ = this.store.select(fromRoot.getCurrentFolder);
  }

  ngOnInit() {
    if(!_.get(this.userService.getSyncProfile(), 'introduction.note')) this.introModal.open();
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_add_modal'});
  }

  onFolder() {
    this.noteService.modalEvent({
      action: 'note:folder:create'
    });
  }

  onBreadcrumbAction(event: any) {
    this.noteService.modalEvent({
      action: event.action,
      payload: event.payload,
      breadcrumb: true
    });
  }
}
