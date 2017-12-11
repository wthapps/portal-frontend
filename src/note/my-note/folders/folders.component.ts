import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { CommonEventService } from '@shared/shared/services/common-event/common-event.service';
import { ZNoteService } from '../../shared/services/note.service';
import { Folder } from '../../shared/reducers/folder';
import { Note } from '@shared/shared/models/note.model';
import * as fromRoot from '../../shared/reducers/index';
import * as note from '../../shared/actions/note';

@Component({
  selector: 'z-note-my-note-folders',
  templateUrl: 'folders.component.html'
})
export class ZNoteMyNoteFoldersComponent {
  // data: any;
  // viewOption: string = 'list';
  // public noteState$: Observable<any>;
  // public noteItems$: Observable<Note[]>;
  // public folderItems$: Observable<Folder[]>;
  // public orderDesc$: Observable<boolean>;
  //
  // constructor(private commonEventService: CommonEventService,
  //             private store: Store<fromRoot.State>,
  //             private noteService: ZNoteService,
  //             private route: ActivatedRoute) {
  //   this.noteState$ = this.store.select(fromRoot.getNotesState);
  //   this.noteItems$ = this.store.select(fromRoot.getSortedNotes);
  //   this.folderItems$ = this.store.select(fromRoot.getSortedFolders);
  //   this.orderDesc$ = this.store.select(fromRoot.getOrderDesc);
  // }
  //
  // ngOnInit() {
  //   this.commonEventService.filter((event: any) => event.channel == 'noteActionsBar').subscribe((event: any) => {
  //     console.log(event);
  //   });
  //
  //   this.route.params.forEach((params: any) => {
  //     console.debug('INSIDE FOLDER: ', params);
  //     this.store.dispatch(new note.Load({parent_id: params['id']}));
  //   });
  // }
  //
  // createNote() {
  //   console.log('creating::: note');
  //   console.debug('current folder id: ', this.route.snapshot.params['id']);
  //   this.noteService.modalEvent({action: 'note:open_note_add_modal', payload: { parent_id: this.route.snapshot.params['id']}});
  // }
}
