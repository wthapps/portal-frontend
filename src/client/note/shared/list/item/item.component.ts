import { Component, OnInit, Input } from '@angular/core';
import { Note } from '../../../../core/shared/models/note.model';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-item',
  templateUrl: 'item.component.html'
})
export class ZNoteSharedItemComponent implements OnInit {
  @Input() item: Note;

  constructor() {

  }

  ngOnInit() {

  }
}
