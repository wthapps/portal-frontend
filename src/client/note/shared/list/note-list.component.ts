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
  @Input() readonly: boolean = false;

  readonly VIEW_MODE = {
    GRID: 'grid',
    LIST: 'list'
  };

  private pressingCtrlKey: boolean = false;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ke: KeyboardEvent) {
    if (this.pressedCtrlKey(ke)) {
      this.pressingCtrlKey = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ke: KeyboardEvent) {
    if (this.pressedCtrlKey(ke)) {
      this.pressingCtrlKey = false;
    }

    //if0 pressing ESC key
    if (ke.keyCode == 27) {
      this.deSelectObjects();
    }
  }


  // sortType: string = 'name';
  // sortDescending: boolean = false;


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


  onActionItem(event: any) {
    console.log(event);

    if (this.pressingCtrlKey) {
      console.log('pressingCtrlKey', true);
    } else {
      console.log('pressingCtrlKey', false);
    }
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true : false);
  }

  private deSelectObjects() {
    console.log('deSelectObjects');
  }
}
