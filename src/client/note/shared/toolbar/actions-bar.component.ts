import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';
import { ZNoteService } from '../services/note.service';
import { Note } from '../../../core/shared/models/note.model';

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



  constructor(public noteService: ZNoteService) {
  }

  ngOnInit() {
  }

  onDelete() {
    if (this.multiple) {
      this.noteService.deleteNote();
    } else {
      this.noteService.deleteNote(this.data);
    }

  }
}
