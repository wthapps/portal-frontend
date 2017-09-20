import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { Note } from '../../../core/shared/models/note.model';
import { ZNoteService } from '../services/note.service';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ZNoteSharedListComponent implements OnInit {
  @Input() data: Note[];
  @Input() viewOption: string = 'list';

  constructor(public noteService: ZNoteService) {
  }

  ngOnInit() {

  }

  onSelectedAll() {
    this.noteService.onSelectAll();
  }

}
