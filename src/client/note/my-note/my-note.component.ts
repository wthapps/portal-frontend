import { Component, OnInit } from '@angular/core';
import { ZNoteService } from '../shared/services/note.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';
import { Store } from '@ngrx/store';

import * as fromRoot from '../shared/reducers/index';
import * as note from '../shared/actions/note';
import { Observable } from 'rxjs';
import { Folder } from '../shared/reducers/folder';
import { Note } from '../../core/shared/models/note.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-my-note',
  templateUrl: 'my-note.component.html'
})
export class ZNoteMyNoteComponent implements OnInit {
  // data: Array<any> = new Array<any>();
  viewOption: string = 'list';
  public noteItems$: Observable<Note[]>;
  public folderItems$: Observable<Folder[]>;
  public orderDesc$: Observable<boolean>;

  constructor(private noteService: ZNoteService, private apiBaseService: ApiBaseService, private commonEventService: CommonEventService, private store: Store<fromRoot.State>) {
    this.noteItems$ = this.store.select(fromRoot.getSortedNotes).do((n: any) => console.debug('Notes: ', n));
    this.folderItems$ = this.store.select(fromRoot.getSortedFolders);
    this.orderDesc$ = this.store.select(fromRoot.getOrderDesc);
  }

  ngOnInit() {
    // this.apiBaseService.get(`note/dashboards`, {parent_id: null}).subscribe((res: any) => {
    //   this.data = res.data;
    //   this.commonEventService.broadcast({channel: 'noteFolderEvent', action: 'updateFolders', payload: this.data});
    // });
    // this.commonEventService.filter((event: any) => event.channel == 'noteFolderEvent' && event.action == 'updateFolders').subscribe((event: any) => {
    //   let tmp = _.clone(event.payload);
    //   this.data.length = 0;
    //
    //   for (let item of tmp) {
    //     if (!item.parent_id) {
    //       this.data.push(item);
    //     }
    //   }
    // });

    this.store.dispatch(new note.Load({parent_id: null}));
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_edit_modal'});
  }
}
