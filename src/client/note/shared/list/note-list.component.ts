import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Note } from '../../../core/shared/models/note.model';
import { ZNoteService } from '../services/note.service';
import * as fromRoot from '../reducers/index';
import * as note from '../actions/note';
import { Folder } from '../reducers/folder';

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
  @Input() noteItems: Note[];
  @Input() folderItems: Folder[];
  @Input() viewOption: string = 'list';
  @Input() orderDesc: boolean;

  sortType: string = 'name';
  // sortDescending: boolean = false;
  selectedIds$: Observable<any[]>;
  isSelectAll$: Observable<boolean>;

  constructor(public noteService: ZNoteService, public store: Store<fromRoot.State>) {
    this.selectedIds$ = this.store.select(fromRoot.getSelectedIds);
    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
  }

  ngOnInit() {
  }

  onSort(name: any) {
    // if (this.sortType == name) {
    //   this.sortDescending = !this.sortDescending;
    // } else {
    //   this.sortDescending = false;
    // }
    // this.sortType = name;
    // this.noteService.changeSortOption(this.sortType, this.sortDescending);

    this.store.dispatch(new note.ChangeSortOrder());
  }

  onSelectedAll() {
    // this.noteService.onSelectAll();
    this.store.dispatch(new note.SelectAll());
  }

}
