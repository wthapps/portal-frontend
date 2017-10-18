import { Component, Input, ViewEncapsulation, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';

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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteListComponent implements OnInit {
  @Input() data: any[];
  @Input() items: any[];
  @Input() noteItems: Note[];
  @Input() folderItems: Folder[];
  @Input() viewOption: string = 'grid';
  @Input() orderDesc: boolean;
  @Input() sortOption: any;
  @Input() isSelectAll: boolean;
  @Input() page: string;

  readonly VIEW_MODE = {
    GRID: 'grid',
    LIST: 'list'
  };

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ke: KeyboardEvent) {

    //if0 pressing ESC key
    if (ke.keyCode == 27) {
      this.deSelectObjects();
    }
  }

  constructor(public noteService: ZNoteService, public store: Store<fromRoot.State>) {
  }

  ngOnInit() {
  }

  onSort(name: any) {
    this.store.dispatch(new note.ChangeSortOrder(name));
  }

  onSelectedAll() {
    this.store.dispatch(new note.SelectAll());
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true : false);
  }

  private deSelectObjects() {
    this.store.dispatch({type: note.DESELECT_ALL});
  }
}
