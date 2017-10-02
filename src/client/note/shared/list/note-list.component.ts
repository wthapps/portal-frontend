import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { Note } from '../../../core/shared/models/note.model';
import { ZNoteService } from '../services/note.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'note-list',
  templateUrl: 'note-list.component.html',
  styleUrls: ['note-list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class NoteListComponent implements OnInit {
  @Input() data: any[];
  @Input() viewOption: string = 'list';

  sortType: string = 'name';
  sortDescending: boolean = false;

  constructor(public noteService: ZNoteService) {
  }

  ngOnInit() {

  }

  onSort(name: any) {
    if (this.sortType == name) {
      this.sortDescending = !this.sortDescending;
    } else {
      this.sortDescending = false;
    }
    this.sortType = name;
    this.noteService.changeSortOption(this.sortType, this.sortDescending);

  }

  onSelectedAll() {
    this.noteService.onSelectAll();
  }

}
