import { Component, Input } from '@angular/core';
import { Note } from '../../../core/shared/models/note.model';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export class ZNoteSharedListComponent {
  @Input() data: Note[];
}
