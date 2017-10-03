import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';
import { ZNoteService } from '../services/note.service';
import { Note } from '../../../core/shared/models/note.model';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import * as note from '../actions/note';
import * as fromRoot from '../reducers/index';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';


@Component({
  moduleId: module.id,
  selector: 'z-note-shared-actions-bar',
  templateUrl: 'actions-bar.component.html',
  styleUrls: ['actions-bar.component.css']
})
export class ZNoteSharedActionBarComponent implements OnInit {
  @Input() multiple: boolean = false;
  @Input() data: Note;
  readonly tooltip: any = Constants.tooltip;
  selectedIds$: Observable<any[]>;

  constructor(public noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              public commonEventService: CommonEventService) {
    this.selectedIds$ = this.store.select(fromRoot.getSelectedIds);
  }

  ngOnInit() {
  }

  onDelete() {
    if (this.multiple) {
      // TODO:
      // this.noteService.deleteNote();
      this.store.dispatch(new note.MultiDelete());
    } else {
      // this.noteService.deleteNote(this.data);
      // let id = this.data.id;
      this.store.dispatch(new note.Delete([{id: this.data.id, object_type: this.data.object_type}]));
    }

  }

  onShare() {
    this.commonEventService.broadcast({channel: 'noteActionsBar', action: 'note:folder:sharing', payload: this.data});
  }

  onEdit() {
    this.commonEventService.broadcast({channel: 'noteActionsBar', action: 'note:folder:edit', payload: this.data});
  }
}
