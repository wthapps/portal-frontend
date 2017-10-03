import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';
import { ZNoteService } from '../services/note.service';
import { Note } from '../../../core/shared/models/note.model';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import * as note from '../actions/note';
import * as fromRoot from '../reducers/index';
import { Store } from '@ngrx/store';


@Component({
  moduleId: module.id,
  selector: 'z-note-shared-actions-bar',
  templateUrl: 'actions-bar.component.html',
  styleUrls: ['actions-bar.component.css']
})
export class ZNoteSharedActionBarComponent implements OnInit {
  @Input() multiple: boolean = false;
  @Input() data: Note;
  tooltip: any = Constants.tooltip;

  constructor(public noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              public commonEventService: CommonEventService) {
  }

  ngOnInit() {
  }

  onDelete() {
    if (this.multiple) {
      // TODO:
      this.noteService.deleteNote();
    } else {
      // this.noteService.deleteNote(this.data);
      let id = this.data.id;
      this.store.dispatch(new note.Delete([id]));
    }

  }

  onShare() {
    this.commonEventService.broadcast({channel: 'noteActionsBar', action: 'note:folder:sharing', payload: this.data});
  }

  onEdit() {
    this.commonEventService.broadcast({channel: 'noteActionsBar', action: 'note:folder:edit', payload: this.data});
  }
}
