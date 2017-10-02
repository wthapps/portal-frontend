import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';
import { ZNoteService } from '../services/note.service';
import { Note } from '../../../core/shared/models/note.model';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-actions-bar',
  templateUrl: 'actions-bar.component.html',
  styleUrls: ['actions-bar.component.css']
})
export class ZNoteSharedActionBarComponent implements OnInit {
  @Input() multiple: boolean = false;
  @Input() data: any;
  tooltip: any = Constants.tooltip;

  constructor(public noteService: ZNoteService, public commonEventService: CommonEventService) {
  }

  ngOnInit() {
  }

  onDelete() {
    if (this.multiple) {
      this.noteService.deleteNote();
    } else {
      this.commonEventService.broadcast({channel: 'noteActionsBar', action: 'note:folder:delete', payload: this.data});
    }

  }

  onEdit() {
    this.commonEventService.broadcast({channel: 'noteActionsBar', action: 'note:folder:edit', payload: this.data});
  }
}
