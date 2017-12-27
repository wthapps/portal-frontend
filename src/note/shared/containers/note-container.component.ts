import { Component, OnInit, ViewChild } from '@angular/core';
import { ZNoteService } from '../services/note.service';
// import { ApiBaseService } from '@shared/services/apibase.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../reducers/index';
import * as listReducer from '../reducers/features/list-mixed-entities';
import * as context from '../reducers/context';
import * as note from '../actions/note';
import * as folder from '../actions/folder';
import { Observable } from 'rxjs/Observable';
import { Folder } from '../reducers/folder';
import { AppStore } from '../app-store';
import { MixedEntityAction } from '../mixed-enity/mixed-entity.action';
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

  viewOption: string = 'grid';
  noteItems$: Observable<Note[]>;
  folderItems$: Observable<Folder[]>;
  selectedObjects$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;
  loading$: Observable<boolean>;
  items: Observable<any>;
  context$: Observable<any>;
  noteConstants: NoteConstants = noteConstants;

  constructor(private noteService: ZNoteService,
     private commonEventService: CommonEventService,
     private userService: UserService,
     private store: Store<any>) {
    this.noteItems$ = this.store.select(listReducer.getNotes);
    this.folderItems$ = this.store.select(listReducer.getFolders);
    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.context$ = this.store.select(context.getContext);
  }

  ngOnInit() {
    if(!_.get(this.userService.profile, 'introduction.note')) this.introModal.open();
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
