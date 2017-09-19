import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Note } from '../../../core/shared/models/note.model';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ZNoteSharedListComponent {
  @Input() data: Note[];
  @Input() viewOption: string = 'list';
}
