import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ZNoteService } from '../services/note.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../reducers/index';
import * as listReducer from '../reducers/features/list-mixed-entities';
import * as context from '../reducers/context';
import { Observable } from 'rxjs';
import { Folder } from '../reducers/folder';
import { noteConstants, NoteConstants } from '../config/constants';
import { Note } from '@shared/shared/models/note.model';
import { ActivatedRoute, Router } from '@angular/router';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';

declare var _: any;

@Component({
  selector: 'z-note-container',
  templateUrl: 'note-container.component.html',
  styleUrls: ['note-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZNoteContainerComponent implements OnInit {
  @Input() breadcrumbs: any;

  viewOption = 'grid';
  noteItems$: Observable<Note[]>;
  folderItems$: Observable<Folder[]>;
  allItems$: Observable<any[]>;
  selectedObjects$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;
  loading$: Observable<boolean>;
  items: Observable<any>;
  context$: Observable<any>;
  currentFolder$: Observable<any>;
  noteConstants: NoteConstants = noteConstants;

  constructor(
    private noteService: ZNoteService,
    private route: ActivatedRoute,
    private router: Router,
    private wthConfirmService: WthConfirmService,
    private store: Store<any>
  ) {
    this.noteItems$ = this.store.select(listReducer.getNotes);
    this.folderItems$ = this.store.select(listReducer.getFolders);
    this.allItems$ = this.store.select(listReducer.getAllItems);
    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
    this.selectedObjects$ = this.store.select(fromRoot.getSelectedObjects);
    this.context$ = this.store.select(context.getContext);
    this.currentFolder$ = this.store.select(fromRoot.getCurrentFolder);
  }

  ngOnInit() {
    // File does not exist
    this.route.queryParams.subscribe((params: any) => {
      if (params.error === 'file_does_not_exist') {
        this.wthConfirmService.confirm({
          message:
            'You are in deleted note or invalid permission',
          header: 'Note not found',
          rejectLabel: null,
          accept: () => {
            this.router.navigate(['my-note']);
          },
          reject: () => {
            this.router.navigate(['my-note']);
          }
        });
      }
    });
  }

  onNewNote() {
    this.noteService.modalEvent({ action: 'note:open_note_add_modal' });
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
